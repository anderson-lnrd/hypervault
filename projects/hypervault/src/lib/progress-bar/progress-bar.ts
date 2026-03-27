import { Component, computed, input } from '@angular/core';

export type HyperProgressBarColor = 'primary' | 'secondary' | 'accent' | 'destructive';
export type HyperProgressBarMode = 'determinate' | 'indeterminate' | 'buffer' | 'query';

@Component({
  selector: 'hyper-progress-bar',
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.scss',
  host: {
    'class': 'hyper-progress-bar',
    'role': 'progressbar',
    '[class]': 'hostClasses()',
    '[attr.aria-valuenow]': 'mode() === "determinate" ? value() : null',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': '100',
  },
})
export class HyperProgressBar {
  /** Current value (0–100). Used in determinate and buffer modes. */
  readonly value = input(0);

  /** Buffer value (0–100). Used only in buffer mode. */
  readonly bufferValue = input(0);

  /** Progress mode. */
  readonly mode = input<HyperProgressBarMode>('determinate');

  /** Color variant. */
  readonly color = input<HyperProgressBarColor>('primary');

  /** Striped pattern. */
  readonly striped = input(false);

  /** Animate stripes. */
  readonly animated = input(false);

  readonly hostClasses = computed(() => {
    const classes = [
      'hyper-progress-bar',
      `hyper-progress-${this.color()}`,
      `hyper-progress-${this.mode()}`,
    ];
    if (this.striped()) classes.push('hyper-progress-striped');
    if (this.animated()) classes.push('hyper-progress-animated');
    return classes.join(' ');
  });

  readonly barTransform = computed(() =>
    `scaleX(${Math.max(0, Math.min(100, this.value())) / 100})`
  );

  readonly bufferTransform = computed(() =>
    `scaleX(${Math.max(0, Math.min(100, this.bufferValue())) / 100})`
  );
}
