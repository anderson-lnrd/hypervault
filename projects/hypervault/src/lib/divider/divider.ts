import { Component, input, computed } from '@angular/core';

export type HyperDividerColor = 'border' | 'muted' | 'primary' | 'secondary';
export type HyperDividerThickness = 'thin' | 'medium' | 'thick';

@Component({
  selector: 'hyper-divider',
  template: '',
  styleUrl: './divider.scss',
  host: {
    'role': 'separator',
    '[class]': 'hostClasses()',
    '[attr.aria-orientation]': 'vertical() ? "vertical" : "horizontal"',
  },
})
export class HyperDivider {
  readonly vertical = input(false);
  readonly inset = input(false);
  readonly color = input<HyperDividerColor>('border');
  readonly thickness = input<HyperDividerThickness>('thin');
  readonly dashed = input(false);

  readonly hostClasses = computed(() => {
    const classes = ['hyper-divider'];
    classes.push(this.vertical() ? 'hyper-divider-vertical' : 'hyper-divider-horizontal');
    classes.push(`hyper-divider-${this.color()}`);
    classes.push(`hyper-divider-${this.thickness()}`);
    if (this.inset()) classes.push('hyper-divider-inset');
    if (this.dashed()) classes.push('hyper-divider-dashed');
    return classes.join(' ');
  });
}
