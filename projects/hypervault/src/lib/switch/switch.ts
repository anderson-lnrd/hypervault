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

export type HyperSwitchColor = 'primary' | 'secondary';

@Component({
  selector: 'hyper-switch',
  templateUrl: './switch.html',
  styleUrl: './switch.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HyperSwitch),
      multi: true,
    },
  ],
  host: {
    '[class]': 'hostClasses()',
    '[class.hyper-switch-checked]': 'checked()',
    '[class.hyper-switch-disabled]': 'disabled()',
  },
})
export class HyperSwitch implements ControlValueAccessor {
  private readonly defaults = inject(HYPER_DEFAULTS, { optional: true });

  readonly color = input<HyperSwitchColor>(this.defaults?.switch?.color ?? 'primary');
  readonly checked = model(false);
  readonly disabled = input(false);

  readonly change = output<boolean>();

  readonly hostClasses = computed(() => {
    return `hyper-switch-base hyper-${this.color()}`;
  });

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  toggle(): void {
    if (this.disabled()) return;
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
