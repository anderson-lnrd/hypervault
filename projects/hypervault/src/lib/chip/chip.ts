import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  computed,
  forwardRef,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type HyperChipColor = 'primary' | 'secondary' | 'accent' | 'destructive';
export type HyperChipVariant = 'filled' | 'outlined' | 'tonal';
export type HyperChipSelectionMode = 'none' | 'single' | 'multiple';

// ── Chip ──

@Component({
  selector: 'hyper-chip',
  templateUrl: './chip.html',
  styleUrl: './chip.scss',
  host: {
    'class': 'hyper-chip',
    '[class]': 'hostClasses()',
    '[class.hyper-chip-selected]': 'selected()',
    '[class.hyper-chip-disabled]': 'disabled()',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '(click)': 'onClick()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class HyperChip {
  /** Chip label text (alternative to content projection). */
  readonly label = input('');

  /** Leading icon. */
  readonly icon = input<string | undefined>(undefined);

  /** Avatar text or URL (shows circle). */
  readonly avatar = input<string | undefined>(undefined);

  /** Color variant. */
  readonly color = input<HyperChipColor>('primary');

  /** Visual variant. */
  readonly variant = input<HyperChipVariant>('filled');

  /** Show remove button. */
  readonly removable = input(false);

  /** Whether this chip can be selected. */
  readonly selectable = input(false);

  /** Selected state. */
  readonly selected = model(false);

  /** Disabled state. */
  readonly disabled = input(false);

  /** Size. */
  readonly size = input<'sm' | 'md'>('md');

  /** Emitted when remove button is clicked. */
  readonly removed = output<void>();

  /** Emitted when selected state changes. */
  readonly selectedChange = output<boolean>();

  /** @internal — parent chip set ref. */
  _chipSet: HyperChipSet | null = null;

  readonly hostClasses = computed(() => {
    const c = [
      'hyper-chip',
      `hyper-chip-${this.variant()}`,
      `hyper-chip-${this.color()}`,
      `hyper-chip-${this.size()}`,
    ];
    if (this.selectable() || this._chipSet?.selectionMode() !== 'none') {
      c.push('hyper-chip-selectable');
    }
    return c.join(' ');
  });

  onClick(): void {
    if (this.disabled()) return;
    if (this.selectable() || (this._chipSet && this._chipSet.selectionMode() !== 'none')) {
      this.toggleSelection();
    }
  }

  onRemove(event: Event): void {
    event.stopPropagation();
    if (this.disabled()) return;
    this.removed.emit();
    this._chipSet?._onChipRemoved(this);
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    if (event.key === 'Delete' || event.key === 'Backspace') {
      if (this.removable()) {
        event.preventDefault();
        this.removed.emit();
        this._chipSet?._onChipRemoved(this);
      }
    }
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.onClick();
    }
  }

  private toggleSelection(): void {
    if (this._chipSet) {
      this._chipSet._onChipSelected(this);
    } else {
      this.selected.set(!this.selected());
      this.selectedChange.emit(this.selected());
    }
  }
}

// ── Chip Set ──

@Component({
  selector: 'hyper-chip-set',
  template: '<ng-content />',
  host: {
    'class': 'hyper-chip-set',
    'role': 'listbox',
    '[attr.aria-multiselectable]': "selectionMode() === 'multiple' || null",
  },
  styles: [`
    :host {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      align-items: center;
    }
  `],
})
export class HyperChipSet implements AfterContentInit {
  /** Selection mode. */
  readonly selectionMode = input<HyperChipSelectionMode>('none');

  /** Color applied to all child chips. */
  readonly color = input<HyperChipColor | undefined>(undefined);

  /** Variant applied to all child chips. */
  readonly variant = input<HyperChipVariant | undefined>(undefined);

  /** Emits selected values on change. */
  readonly selectionChange = output<unknown[]>();

  @ContentChildren(HyperChip) chips!: QueryList<HyperChip>;

  ngAfterContentInit(): void {
    this.registerChips();
    this.chips.changes.subscribe(() => this.registerChips());
  }

  /** @internal */
  _onChipSelected(chip: HyperChip): void {
    const mode = this.selectionMode();
    if (mode === 'none') return;

    if (mode === 'single') {
      this.chips.forEach(c => {
        if (c !== chip) c.selected.set(false);
      });
      chip.selected.set(true);
    } else {
      chip.selected.set(!chip.selected());
    }

    chip.selectedChange.emit(chip.selected());
    const selected = this.chips.filter(c => c.selected()).map(c => c.label() || c);
    this.selectionChange.emit(selected);
  }

  /** @internal */
  _onChipRemoved(_chip: HyperChip): void {
    // Parent can listen to the chip's (removed) event
  }

  private registerChips(): void {
    this.chips.forEach(c => (c._chipSet = this));
  }
}

// ── Chip Input ──

@Component({
  selector: 'hyper-chip-input',
  templateUrl: './chip-input.html',
  styleUrl: './chip.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HyperChipInput),
      multi: true,
    },
  ],
  host: {
    'class': 'hyper-chip-input',
    '[class.hyper-chip-input-disabled]': 'disabled()',
    '[class.hyper-chip-input-focused]': 'focused()',
  },
})
export class HyperChipInput implements ControlValueAccessor {
  /** Current chips (string array). */
  readonly chips = signal<string[]>([]);

  /** Placeholder for the input. */
  readonly placeholder = input('Add...');

  /** Keys that trigger chip creation. */
  readonly separatorKeys = input<string[]>(['Enter', ',']);

  /** Allow duplicate values. */
  readonly allowDuplicates = input(false);

  /** Maximum number of chips. */
  readonly maxChips = input(Infinity);

  /** Show remove button on chips. */
  readonly removable = input(true);

  /** Color of chips. */
  readonly color = input<HyperChipColor>('primary');

  /** Variant of chips. */
  readonly variant = input<HyperChipVariant>('filled');

  /** Disabled state. */
  readonly disabled = input(false);

  /** Whether to add chip on blur. */
  readonly addOnBlur = input(true);

  /** Emitted when a chip is added. */
  readonly chipAdded = output<string>();

  /** Emitted when a chip is removed. */
  readonly chipRemoved = output<string>();

  readonly inputValue = signal('');
  readonly focused = signal(false);

  private onChange: (value: string[]) => void = () => {};
  private onTouched: () => void = () => {};

  onInputKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;

    const value = this.inputValue().trim();

    if (this.separatorKeys().includes(event.key)) {
      event.preventDefault();
      this.addChip(value);
      return;
    }

    if (event.key === 'Backspace' && !value && this.chips().length > 0) {
      this.removeChip(this.chips().length - 1);
    }
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Check for separator characters (e.g., comma)
    const separatorChars = this.separatorKeys().filter(k => k.length === 1);
    for (const sep of separatorChars) {
      if (value.includes(sep)) {
        const parts = value.split(sep).map(p => p.trim()).filter(Boolean);
        for (const part of parts) {
          this.addChip(part);
        }
        this.inputValue.set('');
        input.value = '';
        return;
      }
    }

    this.inputValue.set(value);
  }

  onBlur(): void {
    this.focused.set(false);
    this.onTouched();
    if (this.addOnBlur()) {
      const value = this.inputValue().trim();
      if (value) this.addChip(value);
    }
  }

  onPaste(event: ClipboardEvent): void {
    const text = event.clipboardData?.getData('text') ?? '';
    const separatorChars = this.separatorKeys().filter(k => k.length === 1);
    const regex = new RegExp(`[${separatorChars.map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('')}\\n]`);
    const parts = text.split(regex).map(p => p.trim()).filter(Boolean);

    if (parts.length > 1) {
      event.preventDefault();
      for (const part of parts) {
        this.addChip(part);
      }
    }
  }

  addChip(value: string): void {
    if (!value) return;
    if (this.chips().length >= this.maxChips()) return;
    if (!this.allowDuplicates() && this.chips().includes(value)) return;

    this.chips.update(c => [...c, value]);
    this.inputValue.set('');
    this.chipAdded.emit(value);
    this.onChange(this.chips());
  }

  removeChip(index: number): void {
    const removed = this.chips()[index];
    this.chips.update(c => c.filter((_, i) => i !== index));
    this.chipRemoved.emit(removed);
    this.onChange(this.chips());
  }

  // ── CVA ──

  writeValue(value: string[]): void {
    this.chips.set(Array.isArray(value) ? value : []);
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
