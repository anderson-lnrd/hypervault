import { Component, computed, inject, input } from '@angular/core';

import { HYPER_DEFAULTS } from '../core/defaults';

export type HyperButtonColor = 'primary' | 'secondary' | 'accent' | 'destructive';

export type HyperButtonSize = 'sm' | 'md' | 'lg';

export type HyperHoverEffect =
  | 'none'
  | 'float-3d'
  | 'press-3d'
  | 'hover-accent'
  | 'hover-primary'
  | 'hover-destructive'
  | (string & {});

@Component({
  selector:
    'button[hyper-button], button[hyper-raised-button], button[hyper-stroked-button], button[hyper-icon-button], button[hyper-ghost-button], button[hyper-link-button]',
  templateUrl: './button.html',
  styleUrl: './button.scss',
  host: {
    '[class]': 'hostClasses()',
    '[class.hyper-loading]': 'loading()',
    '[attr.disabled]': 'loading() || null',
  },
})
export class HyperButton {
  private readonly defaults = inject(HYPER_DEFAULTS, { optional: true });

  readonly color = input<HyperButtonColor | undefined>(this.defaults?.button?.color);
  readonly size = input<HyperButtonSize>(this.defaults?.button?.size ?? 'md');
  readonly hoverEffect = input<HyperHoverEffect>('none');
  readonly loading = input(false);

  readonly hostClasses = computed(() => {
    const classes = ['hyper-button-base', `hyper-size-${this.size()}`];
    const effects = this.hoverEffect().split(/\s+/).filter(e => e && e !== 'none');
    for (const effect of effects) {
      classes.push(`hover-${effect}`);
    }
    const c = this.color();
    if (c) {
      classes.push(`hyper-${c}`);
    }
    return classes.join(' ');
  });
}
