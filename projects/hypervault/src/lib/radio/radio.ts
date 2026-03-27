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

export type HyperRadioColor = 'primary' | 'secondary';
export type HyperRadioLayout = 'vertical' | 'horizontal';

// ── Radio Button ──

let nextRadioId = 0;

@Component({
  selector: 'hyper-radio-button',
  templateUrl: './radio.html',
  styleUrl: './radio.scss',
  host: {
    'class': 'hyper-radio-button',
    '[class.hyper-radio-checked]': 'isChecked()',
    '[class.hyper-radio-disabled]': 'effectiveDisabled()',
  },
})
export class HyperRadioButton {
  /** Value of this radio button. */
  readonly value = input.required<unknown>();

  /** Whether this individual radio is disabled. */
  readonly disabled = input(false);

  /** @internal — unique id. */
  readonly inputId = `hyper-radio-${nextRadioId++}`;

  /** @internal — reference to parent group. */
  _group: HyperRadioGroup | null = null;

  readonly isChecked = computed(() => {
    if (!this._group) return false;
    return this._group.value() === this.value();
  });

  readonly effectiveDisabled = computed(() =>
    this.disabled() || (this._group?.disabled() ?? false)
  );

  readonly groupName = computed(() => this._group?.name() ?? '');
  readonly groupColor = computed(() => this._group?.color() ?? 'primary');
  readonly labelPosition = computed(() => this._group?.labelPosition() ?? 'after');

  select(): void {
    if (this.effectiveDisabled()) return;
    this._group?._selectButton(this);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.select();
    }
  }
}

// ── Radio Group ──

let nextGroupId = 0;

@Component({
  selector: 'hyper-radio-group',
  template: '<ng-content />',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HyperRadioGroup),
      multi: true,
    },
  ],
  host: {
    'class': 'hyper-radio-group',
    '[class]': 'hostClasses()',
    'role': 'radiogroup',
  },
})
export class HyperRadioGroup implements ControlValueAccessor, AfterContentInit {
  /** Currently selected value. */
  readonly value = model<unknown>(undefined);

  /** Group name for native radio grouping. */
  readonly name = input(`hyper-radio-group-${nextGroupId++}`);

  /** Whether all radios are disabled. */
  readonly disabled = input(false);

  /** Color applied to all child radio buttons. */
  readonly color = input<HyperRadioColor>('primary');

  /** Label position relative to the radio circle. */
  readonly labelPosition = input<'before' | 'after'>('after');

  /** Layout direction. */
  readonly layout = input<HyperRadioLayout>('vertical');

  /** Emitted when the selection changes. */
  readonly change = output<unknown>();

  @ContentChildren(HyperRadioButton, { descendants: true })
  radioButtons!: QueryList<HyperRadioButton>;

  readonly hostClasses = computed(() =>
    `hyper-radio-group hyper-radio-${this.layout()}`
  );

  private onChange: (value: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  ngAfterContentInit(): void {
    this.registerButtons();
    this.radioButtons.changes.subscribe(() => this.registerButtons());
  }

  /** @internal */
  _selectButton(button: HyperRadioButton): void {
    this.value.set(button.value());
    this.change.emit(button.value());
    this.onChange(button.value());
    this.onTouched();
  }

  writeValue(value: unknown): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  private registerButtons(): void {
    this.radioButtons.forEach(rb => (rb._group = this));
  }
}
