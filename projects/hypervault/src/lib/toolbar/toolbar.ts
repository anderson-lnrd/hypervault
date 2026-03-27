import { Component, Directive, ViewEncapsulation, computed, inject, input } from '@angular/core';

import { HYPER_DEFAULTS } from '../core/defaults';

export type HyperToolbarColor = 'default' | 'primary' | 'secondary' | 'accent';
export type HyperToolbarSize = 'sm' | 'md' | 'lg';

// ── Row Directives ──

/** Groups items to the start (left) of the toolbar. */
@Directive({
  selector: 'hyper-toolbar-start, [hyper-toolbar-start]',
  host: { class: 'hyper-toolbar-start' },
})
export class HyperToolbarStart {}

/** Groups items to the center of the toolbar. */
@Directive({
  selector: 'hyper-toolbar-center, [hyper-toolbar-center]',
  host: { class: 'hyper-toolbar-center' },
})
export class HyperToolbarCenter {}

/** Groups items to the end (right) of the toolbar. */
@Directive({
  selector: 'hyper-toolbar-end, [hyper-toolbar-end]',
  host: { class: 'hyper-toolbar-end' },
})
export class HyperToolbarEnd {}

/** A visual separator line between toolbar items. */
@Component({
  selector: 'hyper-toolbar-separator',
  template: '',
  host: { class: 'hyper-toolbar-separator' },
  styles: `
    :host {
      display: block;
      width: 1px;
      align-self: stretch;
      margin: 0.35rem 0;
      background: var(--_tb-sep, var(--muted-foreground, #a3a3a3));
      opacity: 0.4;
    }
  `,
})
export class HyperToolbarSeparator {}

/** Title directive — applies toolbar title styling. */
@Directive({
  selector: 'hyper-toolbar-title, [hyper-toolbar-title]',
  host: { class: 'hyper-toolbar-title' },
})
export class HyperToolbarTitle {}

// ── Toolbar Row ──

/** Extra row inside a multi-row toolbar. */
@Component({
  selector: 'hyper-toolbar-row',
  template: '<ng-content></ng-content>',
  host: { class: 'hyper-toolbar-row' },
  styles: `
    :host {
      display: flex;
      align-items: center;
      width: 100%;
      gap: inherit;
    }
  `,
})
export class HyperToolbarRow {}

// ── Toolbar Component ──

@Component({
  selector: 'hyper-toolbar',
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'hyper-toolbar',
    'role': 'toolbar',
    '[class]': 'hostClasses()',
    '[class.hyper-toolbar-bordered]': 'bordered()',
    '[class.hyper-toolbar-elevated]': 'elevated()',
    '[class.hyper-toolbar-dense]': 'dense()',
    '[class.hyper-toolbar-sticky]': 'sticky()',
  },
})
export class HyperToolbar {
  private readonly defaults = inject(HYPER_DEFAULTS, { optional: true });

  /** Color variant. */
  readonly color = input<HyperToolbarColor>(this.defaults?.toolbar?.color ?? 'default');

  /** Toolbar height preset. */
  readonly size = input<HyperToolbarSize>(this.defaults?.toolbar?.size ?? 'md');

  /** Show a bottom border (default: true). */
  readonly bordered = input(this.defaults?.toolbar?.bordered ?? true);

  /** Add a brutal box-shadow. */
  readonly elevated = input(this.defaults?.toolbar?.elevated ?? false);

  /** Compact mode — reduces padding and height. */
  readonly dense = input(this.defaults?.toolbar?.dense ?? false);

  /** Makes the toolbar sticky at the top. */
  readonly sticky = input(this.defaults?.toolbar?.sticky ?? false);

  readonly hostClasses = computed(() => {
    const classes = ['hyper-toolbar', `hyper-toolbar-${this.color()}`, `hyper-toolbar-${this.size()}`];
    return classes.join(' ');
  });
}
