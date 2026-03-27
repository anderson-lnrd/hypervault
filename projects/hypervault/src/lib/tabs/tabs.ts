import {
  Component,
  Directive,
  TemplateRef,
  ContentChildren,
  QueryList,
  AfterContentInit,
  computed,
  input,
  model,
  output,
  signal,
  inject,
  contentChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

export type HyperTabsColor = 'primary' | 'secondary' | 'accent';
export type HyperTabsAlign = 'start' | 'center' | 'end' | 'stretch';

// ── Tab Label Directive ──

/** Use inside <hyper-tab> to project a custom label template. */
@Directive({ selector: '[hyper-tab-label]' })
export class HyperTabLabel {
  readonly template = inject(TemplateRef);
}

// ── Lazy Content Directive ──

/** Lazy-rendered content — only instantiated when the tab is active. */
@Directive({ selector: '[hyperTabLazyContent]' })
export class HyperTabLazyContent {
  readonly template = inject(TemplateRef);
}

// ── Tab ──

@Directive({
  selector: 'hyper-tab',
  host: { class: 'hyper-tab' },
})
export class HyperTab {
  /** Plain-text label (overridden by hyper-tab-label projection). */
  readonly label = input('');

  /** Material icon name shown before the label. */
  readonly icon = input<string | undefined>(undefined);

  /** Whether this tab is disabled. */
  readonly disabled = input(false);

  /** Custom label template. */
  readonly labelTpl = contentChild(HyperTabLabel);

  /** Lazy content template. */
  readonly lazyContent = contentChild(HyperTabLazyContent);
}

// ── Tab Group ──

@Component({
  selector: 'hyper-tab-group',
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss',
  imports: [NgTemplateOutlet],
  host: {
    'class': 'hyper-tab-group',
    '[class]': 'hostClasses()',
  },
})
export class HyperTabGroup implements AfterContentInit {
  /** Index of the selected tab. */
  readonly selectedIndex = model(0);

  /** Color of the active tab indicator. */
  readonly color = input<HyperTabsColor>('primary');

  /** Tab header alignment. */
  readonly align = input<HyperTabsAlign>('start');

  /** Bordered style — adds border around the tab content area. */
  readonly bordered = input(false);

  /** Show animated sliding indicator under active tab. */
  readonly animatedIndicator = input(true);

  /** Emits the index when the selected tab changes. */
  readonly selectedTabChange = output<number>();

  @ContentChildren(HyperTab) tabs!: QueryList<HyperTab>;

  /** @internal — signal mirror of QueryList for reactivity. */
  readonly tabList = signal<HyperTab[]>([]);

  /** Currently active tab. */
  readonly activeTab = computed(() => {
    const list = this.tabList();
    const idx = this.selectedIndex();
    return list[idx] ?? list[0];
  });

  readonly hostClasses = computed(() => {
    const classes = ['hyper-tab-group', `hyper-tabs-${this.color()}`, `hyper-tabs-align-${this.align()}`];
    if (this.bordered()) classes.push('hyper-tabs-bordered');
    return classes.join(' ');
  });

  ngAfterContentInit(): void {
    this.syncTabs();
    this.tabs.changes.subscribe(() => this.syncTabs());
  }

  selectTab(index: number): void {
    const tab = this.tabList()[index];
    if (!tab || tab.disabled()) return;
    this.selectedIndex.set(index);
    this.selectedTabChange.emit(index);
  }

  /** Handle keyboard navigation in the tab header. */
  onKeydown(event: KeyboardEvent, index: number): void {
    const list = this.tabList();
    let target: number | null = null;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        target = this.findNextEnabled(index, 1, list);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        target = this.findNextEnabled(index, -1, list);
        break;
      case 'Home':
        target = this.findNextEnabled(-1, 1, list);
        break;
      case 'End':
        target = this.findNextEnabled(list.length, -1, list);
        break;
      default:
        return;
    }

    if (target !== null) {
      event.preventDefault();
      this.selectTab(target);
    }
  }

  private syncTabs(): void {
    this.tabList.set(this.tabs.toArray());
  }

  private findNextEnabled(from: number, direction: 1 | -1, list: HyperTab[]): number | null {
    let i = from + direction;
    while (i >= 0 && i < list.length) {
      if (!list[i].disabled()) return i;
      i += direction;
    }
    return null;
  }
}
