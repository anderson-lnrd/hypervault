import {
  Component,
  computed,
  forwardRef,
  input,
  model,
  output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type HyperSliderColor = 'primary' | 'secondary';

@Component({
  selector: 'hyper-slider',
  templateUrl: './slider.html',
  styleUrl: './slider.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HyperSlider),
      multi: true,
    },
  ],
  host: {
    '[class]': 'hostClasses()',
    '[class.hyper-slider-disabled]': 'disabled()',
  },
})
export class HyperSlider implements ControlValueAccessor {
  readonly color = input<HyperSliderColor>('primary');
  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly value = model(0);
  readonly disabled = input(false);
  readonly showValue = input(true);

  readonly change = output<number>();

  readonly hostClasses = computed(() => {
    return `hyper-slider-base hyper-${this.color()}`;
  });

  readonly displayValue = computed(() => {
    const min = this.min();
    const max = this.max();
    const range = max - min;
    if (range === 0) return '0%';
    return Math.round(((this.value() - min) / range) * 100) + '%';
  });

  readonly fillPercent = computed(() => {
    const min = this.min();
    const max = this.max();
    const range = max - min;
    if (range === 0) return 0;
    return ((this.value() - min) / range) * 100;
  });

  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const val = Number(target.value);
    this.value.set(val);
    this.change.emit(val);
    this.onChange(val);
  }

  onBlur(): void {
    this.onTouched();
  }

  writeValue(value: number): void {
    this.value.set(value ?? 0);
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
