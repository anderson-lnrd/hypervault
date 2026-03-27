import {
  Component,
  computed,
  forwardRef,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { HYPER_DEFAULTS } from '../core/defaults';

export type HyperCheckboxColor = 'primary' | 'secondary';

@Component({
  selector: 'hyper-checkbox',
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HyperCheckbox),
      multi: true,
    },
  ],
  host: {
    '[class]': 'hostClasses()',
    '[class.hyper-checkbox-disabled]': 'disabled()',
    '[class.hyper-checkbox-checked]': 'checked()',
    '[class.hyper-checkbox-indeterminate]': 'indeterminate()',
  },
})
export class HyperCheckbox implements ControlValueAccessor {
  private readonly defaults = inject(HYPER_DEFAULTS, { optional: true });

  readonly color = input<HyperCheckboxColor>(this.defaults?.checkbox?.color ?? 'primary');
  readonly checked = model(false);
  readonly indeterminate = model(false);
  readonly disabled = input(false);

  /** Emits when the checked state changes via user interaction. */
  readonly change = output<boolean>();

  readonly hostClasses = computed(() => {
    return `hyper-checkbox-base hyper-${this.color()}`;
  });

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  toggle(): void {
    if (this.disabled()) return;
    this.indeterminate.set(false);
    this.checked.set(!this.checked());
    this.change.emit(this.checked());
    this.onChange(this.checked());
    this.onTouched();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.toggle();
    }
  }

  writeValue(value: boolean): void {
    this.checked.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
