import {
  AfterViewInit,
  Component,
  DestroyRef,
  DOCUMENT,
  NgZone,
  OnDestroy,
  ViewEncapsulation,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

// ── Types ──

export interface HyperTocEntry {
  id: string;
  text: string;
  level: number;
  icon?: string;
  children: HyperTocEntry[];
}

export type HyperPageSummaryPosition = 'inline' | 'sticky' | 'fixed-end';

// ── Recursive list sub-component ──

@Component({
  selector: 'hyper-page-summary-list',
  template: `
    @for (entry of entries(); track entry.id) {
      <div
        class="hyper-ps-item"
        [class.hyper-ps-item-active]="activeId() === entry.id"
        [attr.data-level]="entry.level">
        <button class="hyper-ps-link" (click)="onScrollTo()(entry.id)" type="button">
          <span class="material-icons hyper-ps-icon">{{ entry.icon || levelIcon(entry.level) }}</span>
          <span class="hyper-ps-label">{{ entry.text }}</span>
        </button>
        @if (entry.children.length) {
          <div class="hyper-ps-children">
            <hyper-page-summary-list
              [entries]="entry.children"
              [activeId]="activeId()"
              [onScrollTo]="onScrollTo()" />
          </div>
        }
      </div>
    }
  `,
  host: { class: 'hyper-ps-list' },
})
export class HyperPageSummaryList {
  readonly entries = input.required<HyperTocEntry[]>();
  readonly activeId = input('');
  readonly onScrollTo = input<(id: string) => void>((_id: string) => {});

  levelIcon(level: number): string {
    if (level <= 2) return 'tag';
    if (level === 3) return 'chevron_right';
    return 'fiber_manual_record';
  }
}

// ── Main component ──

@Component({
  selector: 'hyper-page-summary',
  imports: [HyperPageSummaryList],
  templateUrl: './page-summary.html',
  styleUrl: './page-summary.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'hyper-page-summary',
    '[class.hyper-ps-sticky]': 'position() === "sticky"',
    '[class.hyper-ps-fixed-end]': 'position() === "fixed-end"',
  },
})
export class HyperPageSummary implements AfterViewInit, OnDestroy {
  private readonly doc = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router, { optional: true });

  /** CSS selector for the element to scan for headings. Defaults to `.demo-page`. */
  readonly container = input('.demo-page');

  /** Title shown in the summary header. Set to empty string to hide. */
  readonly title = input('Nesta página');

  /** CSS selector for heading elements to include. Only elements with an `id` will be captured. */
  readonly selectors = input('h2[id], h3[id], h4[id]');

  /** Map of heading element id → Material Icon name for custom icons. */
  readonly icons = input<Record<string, string>>({});

  /** Positioning strategy: `inline` | `sticky` | `fixed-end`. */
  readonly position = input<HyperPageSummaryPosition>('inline');

  readonly entries = signal<HyperTocEntry[]>([]);
  readonly activeId = signal('');

  private observer?: IntersectionObserver;
  private allHeadings: HTMLElement[] = [];

  ngAfterViewInit(): void {
    // setTimeout ensures lazy-loaded route components have fully rendered
    setTimeout(() => {
      this.buildToc();
      this.setupObserver();
    }, 150);

    // Rebuild on every route change — handles the app-shell use-case where
    // the component stays mounted while navigating between doc pages
    this.router?.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        setTimeout(() => this.rebuild(), 150);
      });
  }

  private rebuild(): void {
    this.observer?.disconnect();
    this.observer = undefined;
    this.allHeadings = [];
    this.activeId.set('');
    this.buildToc();
    this.setupObserver();
  }

  private buildToc(): void {
    const containerEl = this.doc.querySelector(this.container()) ?? this.doc.body;
    // Exclude any headings that live inside another hyper-page-summary (avoid self-capture)
    const headings = Array.from(
      containerEl.querySelectorAll<HTMLElement>(this.selectors())
    ).filter(el => !el.closest('hyper-page-summary'));

    this.allHeadings = headings;

    const iconMap = this.icons();
    const flat: HyperTocEntry[] = headings.map(el => ({
      id: el.id,
      text: el.textContent?.trim() ?? el.id,
      level: parseInt(el.tagName[1], 10),
      icon: iconMap[el.id],
      children: [],
    }));

    this.entries.set(this.buildTree(flat));
  }

  private buildTree(flat: HyperTocEntry[]): HyperTocEntry[] {
    const root: HyperTocEntry[] = [];
    const stack: HyperTocEntry[] = [];
    for (const entry of flat) {
      while (stack.length && stack[stack.length - 1].level >= entry.level) {
        stack.pop();
      }
      if (!stack.length) {
        root.push(entry);
      } else {
        stack[stack.length - 1].children.push(entry);
      }
      stack.push(entry);
    }
    return root;
  }

  private setupObserver(): void {
    if (!this.allHeadings.length) return;

    this.zone.runOutsideAngular(() => {
      const containerEl = this.doc.querySelector(this.container()) ?? this.doc.body;
      // Use the nearest scroll container as IntersectionObserver root so
      // rootMargin works correctly inside custom scroll containers (e.g. hyper-sidenav)
      const scrollRoot = this.findScrollContainer(containerEl);

      const visible = new Set<string>();
      this.observer = new IntersectionObserver(
        entries => {
          for (const e of entries) {
            const id = (e.target as HTMLElement).id;
            if (e.isIntersecting) visible.add(id);
            else visible.delete(id);
          }
          // Highlight the topmost visible heading
          const first = this.allHeadings.find(h => visible.has(h.id));
          this.zone.run(() => this.activeId.set(first?.id ?? ''));
        },
        {
          root: scrollRoot,
          rootMargin: '-70px 0px -55% 0px',
          threshold: 0,
        },
      );

      for (const h of this.allHeadings) {
        this.observer.observe(h);
      }
    });
  }

  /** Walk up the DOM to find the nearest element with overflow scroll/auto. */
  private findScrollContainer(el: Element): Element | null {
    let parent = el.parentElement;
    while (parent && parent !== this.doc.documentElement) {
      const { overflow, overflowY } = getComputedStyle(parent);
      if (['auto', 'scroll'].includes(overflow) || ['auto', 'scroll'].includes(overflowY)) {
        return parent;
      }
      parent = parent.parentElement;
    }
    return null;
  }

  /** Scroll to the element with the given id, respecting scroll-margin-top. */
  readonly scrollTo = (id: string): void => {
    this.doc.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
