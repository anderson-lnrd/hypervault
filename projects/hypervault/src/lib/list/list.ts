import {
  Component,
  Directive,
  ContentChildren,
  QueryList,
  ElementRef,
  AfterContentInit,
  ViewEncapsulation,
  computed,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

// ── List ──

@Component({
  selector: 'hyper-list',
  template: '<ng-content />',
  styleUrl: './list.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'hyper-list',
    'role': 'list',
    '[class.hyper-list-dense]': 'dense()',
    '[class.hyper-list-bordered]': 'bordered()',
    '[class.hyper-list-interactive]': 'interactive()',
  },
})
export class HyperList {
  readonly dense = input(false);
  readonly bordered = input(false);
  readonly interactive = input(true);
}

// ── List Item ──

@Component({
  selector: 'hyper-list-item',
  template: `
    <ng-content select="[hyper-list-item-icon]" />
    <div class="hyper-list-item-content">
      <ng-content />
    </div>
    <ng-content select="[hyper-list-item-meta]" />
  `,
  styleUrl: './list.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'hyper-list-item',
    'role': 'listitem',
    '[class.hyper-list-item-disabled]': 'disabled()',
    '[class.hyper-list-item-selected]': 'selected()',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '(click)': 'onActivate()',
    '(keydown.enter)': 'onActivate()',
  },
})
export class HyperListItem {
  readonly disabled = input(false);
  readonly selected = input(false);
  readonly activated = output<void>();

  onActivate(): void {
    if (!this.disabled()) this.activated.emit();
  }
}

// ── List Item Icon (leading slot) ──

@Directive({
  selector: '[hyper-list-item-icon]',
  host: {
    'class': 'hyper-list-item-icon',
    'style': `
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      font-size: 1.25rem;
      color: var(--muted-foreground);
    `,
  },
})
export class HyperListItemIcon {}

// ── List Item Meta (trailing slot) ──

@Directive({
  selector: '[hyper-list-item-meta]',
  host: {
    'class': 'hyper-list-item-meta',
    'style': `
      display: flex;
      align-items: center;
      flex-shrink: 0;
      margin-left: auto;
      font-size: 0.75rem;
      color: var(--muted-foreground);
    `,
  },
})
export class HyperListItemMeta {}

// ── List Item Line (multi-line) ──

@Directive({
  selector: '[hyper-list-item-line]',
  host: {
    'class': 'hyper-list-item-line',
  },
})
export class HyperListItemLine {}

// ── List Divider ──

@Component({
  selector: 'hyper-list-divider',
  template: '',
  host: {
    'class': 'hyper-list-divider',
    'role': 'separator',
    'style': `
      display: block;
      height: 0;
      border: none;
      border-top: 1px solid var(--border);
      margin: 0.25rem 0;
    `,
  },
})
export class HyperListDivider {}

// ── List Subheader ──

@Directive({
  selector: 'hyper-list-subheader, [hyper-list-subheader]',
  host: {
    'class': 'hyper-list-subheader',
    'style': `
      display: block;
      padding: 0.75rem 1rem 0.25rem;
      font-family: var(--font-sans);
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--muted-foreground);
    `,
  },
})
export class HyperListSubheader {}

// ── Selection List ──

@Component({
  selector: 'hyper-selection-list',
  template: '<ng-content />',
  styleUrl: './list.scss',
  host: {
    'class': 'hyper-list hyper-selection-list',
    'role': 'listbox',
    '[class.hyper-list-dense]': 'dense()',
    '[class.hyper-list-bordered]': 'bordered()',
    '[attr.aria-multiselectable]': 'multiple()',
  },
})
export class HyperSelectionList implements AfterContentInit {
  readonly multiple = input(true);
  readonly dense = input(false);
  readonly bordered = input(false);
  readonly color = input<'primary' | 'secondary'>('primary');
  readonly selectionChange = output<unknown[]>();

  @ContentChildren(forwardRef(() => HyperListOption)) options!: QueryList<HyperListOption>;

  ngAfterContentInit(): void {
    this.options.forEach(opt => opt._list = this);
    this.options.changes.subscribe(() =>
      this.options.forEach(opt => opt._list = this)
    );
  }

  /** @internal */
  _onOptionToggle(option: HyperListOption): void {
    if (!this.multiple()) {
      this.options.forEach(o => {
        if (o !== option) o._selected.set(false);
      });
    }
    const selected = this.options.filter(o => o._selected()).map(o => o.value());
    this.selectionChange.emit(selected);
  }
}

// ── List Option (for selection list) ──

@Component({
  selector: 'hyper-list-option',
  template: `
    <span class="hyper-list-option-checkbox"
          [class.hyper-list-option-checked]="_selected()"
          [class]="'hyper-list-option-' + (_list?.color() ?? 'primary')">
      @if (_selected()) {
        <span class="material-icons" style="font-size: 14px;">check</span>
      }
    </span>
    <div class="hyper-list-item-content">
      <ng-content />
    </div>
  `,
  styleUrl: './list.scss',
  host: {
    'class': 'hyper-list-item hyper-list-option',
    'role': 'option',
    '[class.hyper-list-item-selected]': '_selected()',
    '[class.hyper-list-item-disabled]': 'disabled()',
    '[attr.aria-selected]': '_selected()',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '(click)': 'toggle()',
    '(keydown.enter)': 'toggle()',
    '(keydown.space)': '$event.preventDefault(); toggle()',
  },
})
export class HyperListOption {
  readonly value = input.required<unknown>();
  readonly disabled = input(false);
  readonly selected = input(false);

  /** @internal */
  _selected = signal(false);
  /** @internal */
  _list: HyperSelectionList | null = null;

  constructor() {
    // Initialize from input after first check
    const self = this;
    setTimeout(() => self._selected.set(self.selected()));
  }

  toggle(): void {
    if (this.disabled()) return;
    this._selected.update(v => !v);
    this._list?._onOptionToggle(this);
  }
}
