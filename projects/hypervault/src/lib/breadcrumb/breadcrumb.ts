import {
  Component,
  Directive,
  Injectable,
  InjectionToken,
  computed,
  inject,
  input,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Data,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { filter, map, startWith } from 'rxjs';

// ── Types ──

/** A single breadcrumb item. */
export interface HyperBreadcrumbItem {
  /** Display label. */
  label: string;
  /** Router-navigable URL. */
  url: string;
  /** Optional Material Icon name. */
  icon?: string;
  /** Optional fragment for anchor navigation (e.g. 'section-1'). */
  fragment?: string;
}

/** Breadcrumb value in route data — string, or function receiving resolved route data. */
export type HyperBreadcrumbData = string | ((data: Data) => string);

/** Global home configuration. */
export interface HyperBreadcrumbHomeConfig {
  label: string;
  url: string;
  icon?: string;
}

/**
 * Injection token to configure the "Home" breadcrumb globally.
 *
 * @example
 * providers: [
 *   { provide: HYPER_BREADCRUMB_HOME, useValue: { label: 'Inicio', url: '/', icon: 'home' } }
 * ]
 */
export const HYPER_BREADCRUMB_HOME = new InjectionToken<HyperBreadcrumbHomeConfig>(
  'HYPER_BREADCRUMB_HOME',
);

// ── Service ──

/**
 * Builds breadcrumb items by traversing the Angular Router's activated route tree.
 *
 * Routes should define `data: { breadcrumb: 'Label' }` or use the `title` property.
 * Dynamic labels via resolvers: `data: { breadcrumb: (data) => data['product'].name }`.
 */
@Injectable({ providedIn: 'root' })
export class HyperBreadcrumbService {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly homeConfig = inject(HYPER_BREADCRUMB_HOME, { optional: true });

  /** Reactive breadcrumb items, updated on every navigation. */
  readonly items = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      startWith(null),
      map(() => this.build()),
    ),
    { initialValue: [] as HyperBreadcrumbItem[] },
  );

  private build(): HyperBreadcrumbItem[] {
    const items: HyperBreadcrumbItem[] = [];

    // Home item
    if (this.homeConfig) {
      items.push({
        label: this.homeConfig.label,
        url: this.homeConfig.url,
        icon: this.homeConfig.icon,
      });
    }

    this.walk(this.activatedRoute.root.snapshot, '', items);

    // Fragment → extra breadcrumb item for anchor navigation
    const url = this.router.url;
    const hashIndex = url.indexOf('#');
    if (hashIndex > -1) {
      const fragment = url.substring(hashIndex + 1);
      if (fragment) {
        const basePath = url.substring(0, hashIndex);
        const label = fragment
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
        items.push({ label, url: basePath, fragment });
      }
    }

    return items;
  }

  private walk(
    snapshot: ActivatedRouteSnapshot,
    parentUrl: string,
    items: HyperBreadcrumbItem[],
  ): void {
    for (const child of snapshot.children) {
      const segments = child.url.map((s) => s.path);
      const url = segments.length ? `${parentUrl}/${segments.join('/')}` : parentUrl;

      const breadcrumbData = child.data['breadcrumb'] as HyperBreadcrumbData | undefined;
      const title = child.data['title'] ?? child.title;

      const resolvedUrl = url || '/';

      // Skip if this would duplicate the home item
      if (this.homeConfig && resolvedUrl === this.homeConfig.url && items.length > 0 && items[0].url === resolvedUrl) {
        this.walk(child, url, items);
        continue;
      }

      if (breadcrumbData) {
        const label =
          typeof breadcrumbData === 'function' ? breadcrumbData(child.data) : breadcrumbData;
        items.push({ label, url: resolvedUrl });
      } else if (title && typeof title === 'string') {
        items.push({ label: title, url: resolvedUrl });
      }

      this.walk(child, url, items);
    }
  }
}

// ── Separator Directive ──

/** Custom separator via content projection: `<hyper-breadcrumb-separator>/</hyper-breadcrumb-separator>` */
@Directive({
  selector: 'hyper-breadcrumb-separator',
  host: { style: 'display: none;' },
})
export class HyperBreadcrumbSeparator {}

// ── Component ──

@Component({
  selector: 'hyper-breadcrumb',
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
  imports: [RouterLink],
  host: {
    class: 'hyper-breadcrumb',
    role: 'navigation',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class HyperBreadcrumb {
  /**
   * Manual items — overrides auto-detection from router.
   * Use this for non-router scenarios or full manual control.
   */
  readonly items = input<HyperBreadcrumbItem[]>();

  /** Separator character between items. Default: `›`. Ignored if `<hyper-breadcrumb-separator>` is projected. */
  readonly separator = input('›');

  /** Whether breadcrumb links should navigate. Set to false for visual-only demos. */
  readonly navigable = input(true);

  /** Accessible label for the nav element. */
  readonly ariaLabel = input('Breadcrumb');

  private readonly service = inject(HyperBreadcrumbService);
  private readonly document = inject(DOCUMENT);

  /** Resolved items: manual input or auto-detected from router. */
  readonly resolvedItems = computed(() => this.items() ?? this.service.items());

  /** Scrolls to the element matching the fragment id. */
  scrollToFragment(fragment: string | undefined): void {
    if (!fragment) return;
    // Allow router navigation to settle, then scroll
    setTimeout(() => {
      const el = this.document.getElementById(fragment);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 96; // 6rem offset
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  }
}
