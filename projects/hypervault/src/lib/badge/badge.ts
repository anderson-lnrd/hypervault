import { Component, computed, input } from '@angular/core';

export type HyperBadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive';
export type HyperBadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

@Component({
  selector: 'hyper-badge',
  template: '<ng-content></ng-content>',
  styleUrl: './badge.scss',
  host: {
    '[class]': 'hostClasses()',
  },
})
export class HyperBadge {
  readonly variant = input<HyperBadgeVariant>('default');
  readonly rarity = input<HyperBadgeRarity | undefined>();

  readonly hostClasses = computed(() => {
    const r = this.rarity();
    if (r) {
      return `hyper-badge-base hyper-rarity-${r}`;
    }
    return `hyper-badge-base hyper-badge-${this.variant()}`;
  });
}
