import {
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  QueryList,
  AfterContentInit,
  OnDestroy,
  TemplateRef,
  ViewChild,
  computed,
  contentChild,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// ── Option Group ──

@Component({
  selector: 'hyper-optgroup',
  template: `
    <span class="hyper-optgroup-label">{{ label() }}</span>
    <ng-content />
  `,
  styles: [`
    :host {
      display: block;
    }
    .hyper-optgroup-label {
      display: block;
      padding: 0.6rem 0.85rem 0.25rem;
      font-family: var(--font-sans);
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--muted-foreground);
    }
    :host(.hyper-optgroup-disabled) {
      opacity: 0.35;
      pointer-events: none;
    }
  `],
  host: {
    'class': 'hyper-optgroup',
    'role': 'group',
    '[attr.aria-label]': 'label()',
    '[class.hyper-optgroup-disabled]': 'disabled()',
  },
})
export class HyperOptGroup {
  readonly label = input('');
  readonly disabled = input(false);
}

// ── Option ──

@Component({
  selector: 'hyper-option',
  template: `
    @if (_select?.multiple()) {
      <span class="hyper-option-checkbox" [class.hyper-option-checkbox-checked]="isSelected()">
        @if (isSelected()) {
          <svg viewBox="0 0 24 24" fill="none" class="hyper-option-check-icon">
            <polyline points="4,12 9,17 20,6" stroke="currentColor" stroke-width="3" stroke-linecap="square"/>
          </svg>
        }
      </span>
    }
    <span class="hyper-option-text"><ng-content /></span>
  `,
  styleUrl: './select.scss',
  host: {
    'class': 'hyper-option',
    'role': 'option',
    '[class.hyper-option-selected]': 'isSelected()',
    '[class.hyper-option-disabled]': 'effectiveDisabled()',
    '[attr.aria-selected]': 'isSelected()',
    '[attr.aria-disabled]': 'effectiveDisabled()',
    '[attr.tabindex]': 'effectiveDisabled() ? -1 : 0',
    '(click)': 'select()',
    '(keydown.enter)': 'select()',
    '(keydown.space)': '$event.preventDefault(); select()',
  },
})
export class HyperOption {
  readonly value = input.required<unknown>();
  readonly disabled = input(false);

  /** @internal */
  _select: HyperSelect | null = null;
  _group: HyperOptGroup | null = null;

  readonly effectiveDisabled = computed(() =>
    this.disabled() || (this._group?.disabled() ?? false)
  );

  readonly isSelected = computed(() => {
    if (!this._select) return false;
    const val = this._select.value();
    if (this._select.multiple()) {
      return Array.isArray(val) && val.includes(this.value());
    }
    return this._select.compareFn()(val, this.value());
  });

  /** Text content for display in trigger. */
  get viewValue(): string {
    return (this._el.nativeElement as HTMLElement).textContent?.trim() ?? '';
  }

  private readonly _el = inject(ElementRef);

  select(): void {
    if (this.effectiveDisabled()) return;
    this._select?._onOptionSelected(this);
  }
}

// ── Custom Trigger ──

@Directive({ selector: '[hyper-select-trigger]' })
export class HyperSelectTrigger {
  readonly template = inject(TemplateRef);
}

// ── Select ──

@Component({
  selector: 'hyper-select',
  templateUrl: './select.html',
  styleUrl: './select.scss',
  imports: [NgTemplateOutlet],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HyperSelect),
      multi: true,
    },
  ],
  host: {
    'class': 'hyper-select',
    '[class.hyper-select-open]': 'isOpen()',
    '[class.hyper-select-disabled]': 'disabled()',
    '[class.hyper-select-multiple]': 'multiple()',
  },
})
export class HyperSelect implements ControlValueAccessor, AfterContentInit, OnDestroy {
  /** Current value. */
  readonly value = signal<unknown>(undefined);

  /** Placeholder text. */
  readonly placeholder = input('');

  /** Disabled state. */
  readonly disabled = input(false);

  /** Allow multiple selection. */
  readonly multiple = input(false);

  /** Compare function for value matching. */
  readonly compareWith = input<(a: unknown, b: unknown) => boolean>(
    (a: unknown, b: unknown) => a === b
  );

  /** Color. */
  readonly color = input<'primary' | 'secondary'>('primary');

  /** Required state. */
  readonly required = input(false);

  /** Emits on selection change. */
  readonly selectionChange = output<unknown>();

  /** Emits when dropdown opens/closes. */
  readonly openedChange = output<boolean>();

  readonly isOpen = signal(false);

  @ContentChildren(HyperOption, { descendants: true }) options!: QueryList<HyperOption>;
  @ContentChildren(HyperOptGroup) optGroups!: QueryList<HyperOptGroup>;
  @ViewChild('panel') panelRef!: ElementRef<HTMLElement>;

  readonly customTrigger = contentChild(HyperSelectTrigger);

  private readonly document = inject(DOCUMENT);
  private readonly elRef = inject(ElementRef);

  readonly compareFn = computed(() => this.compareWith());

  /** Display text for the trigger. */
  readonly triggerText = computed(() => {
    const val = this.value();
    if (val === undefined || val === null) return '';
    if (this.multiple() && Array.isArray(val)) {
      return this.getOptionsForValues(val).map(o => o.viewValue).join(', ');
    }
    const opt = this.findOption(val);
    return opt?.viewValue ?? '';
  });

  private outsideClickHandler = (e: Event) => {
    if (!this.elRef.nativeElement.contains(e.target as Node)) {
      this.close();
    }
  };

  private escHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.close();
  };

  private onChange: (value: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  ngAfterContentInit(): void {
    this.registerOptions();
    this.options.changes.subscribe(() => this.registerOptions());
    this.optGroups.changes.subscribe(() => this.registerOptGroups());
    this.registerOptGroups();
  }

  ngOnDestroy(): void {
    this.removeListeners();
  }

  toggle(): void {
    if (this.disabled()) return;
    this.isOpen() ? this.close() : this.open();
  }

  open(): void {
    if (this.disabled() || this.isOpen()) return;
    this.isOpen.set(true);
    this.openedChange.emit(true);
    // Defer to next tick so panel is rendered
    setTimeout(() => {
      this.document.addEventListener('click', this.outsideClickHandler);
      this.document.addEventListener('keydown', this.escHandler);
    });
  }

  close(): void {
    if (!this.isOpen()) return;
    this.isOpen.set(false);
    this.openedChange.emit(false);
    this.removeListeners();
    this.onTouched();
  }

  /** @internal */
  _onOptionSelected(option: HyperOption): void {
    if (this.multiple()) {
      const current = (Array.isArray(this.value()) ? this.value() : []) as unknown[];
      const idx = current.findIndex(v => this.compareFn()(v, option.value()));
      const next = idx >= 0
        ? current.filter((_, i) => i !== idx)
        : [...current, option.value()];
      this.value.set(next);
      this.selectionChange.emit(next);
      this.onChange(next);
    } else {
      this.value.set(option.value());
      this.selectionChange.emit(option.value());
      this.onChange(option.value());
      this.close();
    }
  }

  /** Keyboard navigation inside the panel. */
  onPanelKeydown(event: KeyboardEvent): void {
    const opts = this.options.filter(o => !o.effectiveDisabled());
    const focused = this.document.activeElement;
    const idx = opts.findIndex(o => (o as any)._el?.nativeElement === focused);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (idx < opts.length - 1) (opts[idx + 1] as any)._el?.nativeElement?.focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (idx > 0) (opts[idx - 1] as any)._el?.nativeElement?.focus();
        break;
    }
  }

  // ── CVA ──

  writeValue(value: unknown): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // disabled is an input, so CVA disable is handled externally
  }

  // ── Helpers ──

  private findOption(val: unknown): HyperOption | undefined {
    return this.options?.find(o => this.compareFn()(o.value(), val));
  }

  private getOptionsForValues(values: unknown[]): HyperOption[] {
    return values
      .map(v => this.findOption(v))
      .filter((o): o is HyperOption => !!o);
  }

  private registerOptions(): void {
    this.options.forEach(o => (o._select = this));
    this.registerOptGroups();
  }

  private registerOptGroups(): void {
    // Link options to their parent optgroup
    this.optGroups?.forEach(g => {
      const el = (g as any)._el?.nativeElement ?? (inject(ElementRef, { optional: true }) as any)?.nativeElement;
    });
  }

  private removeListeners(): void {
    this.document.removeEventListener('click', this.outsideClickHandler);
    this.document.removeEventListener('keydown', this.escHandler);
  }
}
