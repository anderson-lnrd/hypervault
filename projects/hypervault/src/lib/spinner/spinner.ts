import { Component, computed, input } from '@angular/core';

export type HyperSpinnerColor = 'primary' | 'secondary' | 'accent' | 'destructive' | 'current';
export type HyperSpinnerMode = 'indeterminate' | 'determinate';

@Component({
  selector: 'hyper-spinner',
  templateUrl: './spinner.html',
  styleUrl: './spinner.scss',
  host: {
    'class': 'hyper-spinner',
    'role': 'progressbar',
    '[class]': 'hostClasses()',
    '[style.width.px]': 'diameter()',
    '[style.height.px]': 'diameter()',
    '[attr.aria-valuenow]': 'mode() === "determinate" ? value() : null',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': '100',
  },
})
export class HyperSpinner {
  /** Spinner diameter in px. */
  readonly diameter = input(40);

  /** Stroke width in px. */
  readonly strokeWidth = input(4);

  /** Current value (0–100), for determinate mode. */
  readonly value = input(0);

  /** Spinner mode. */
  readonly mode = input<HyperSpinnerMode>('indeterminate');

  /** Color variant. 'current' uses currentColor. */
  readonly color = input<HyperSpinnerColor>('primary');

  readonly hostClasses = computed(() =>
    `hyper-spinner hyper-spinner-${this.color()} hyper-spinner-${this.mode()}`
  );

  readonly viewBox = computed(() => {
    const d = this.diameter();
    return `0 0 ${d} ${d}`;
  });

  readonly radius = computed(() =>
    (this.diameter() - this.strokeWidth()) / 2
  );

  readonly circumference = computed(() =>
    2 * Math.PI * this.radius()
  );

  readonly dashOffset = computed(() => {
    if (this.mode() === 'indeterminate') return 0;
    return this.circumference() * (1 - Math.max(0, Math.min(100, this.value())) / 100);
  });

  readonly center = computed(() => this.diameter() / 2);
}
