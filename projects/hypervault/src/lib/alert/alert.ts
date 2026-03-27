import { Component, Directive, ViewEncapsulation, computed, input, output } from '@angular/core';

export type HyperAlertVariant = 'info' | 'success' | 'warning' | 'error';

/** Icon displayed at the start of the alert. */
@Directive({
  selector: 'hyper-alert-icon, [hyper-alert-icon]',
  host: { class: 'hyper-alert-icon' },
})
export class HyperAlertIcon {}

/** Title inside the alert. */
@Directive({
  selector: 'hyper-alert-title, [hyper-alert-title]',
  host: { class: 'hyper-alert-title' },
})
export class HyperAlertTitle {}

/** Actions slot (buttons, links). */
@Directive({
  selector: 'hyper-alert-actions, [hyper-alert-actions]',
  host: { class: 'hyper-alert-actions' },
})
export class HyperAlertActions {}

@Component({
  selector: 'hyper-alert',
  templateUrl: './alert.html',
  styleUrl: './alert.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'hyper-alert',
    'role': 'alert',
    '[class]': 'hostClasses()',
    '[class.hyper-alert-outlined]': 'outlined()',
    '[class.hyper-alert-filled]': 'filled()',
  },
})
export class HyperAlert {
  /** Alert variant — controls color and default icon. */
  readonly variant = input<HyperAlertVariant>('info');

  /** Outlined style (border only, transparent bg). */
  readonly outlined = input(false);

  /** Filled style (solid bg). Default is soft/tinted bg. */
  readonly filled = input(false);

  /** Whether the alert can be dismissed via an X button. */
  readonly dismissible = input(false);

  /** Emits when the dismiss button is clicked. */
  readonly dismissed = output<void>();

  /** Default icon per variant. */
  readonly defaultIcon = computed(() => {
    switch (this.variant()) {
      case 'info': return 'info';
      case 'success': return 'check_circle';
      case 'warning': return 'warning';
      case 'error': return 'error';
    }
  });

  readonly hostClasses = computed(() =>
    `hyper-alert hyper-alert-${this.variant()}`
  );

  onDismiss(): void {
    this.dismissed.emit();
  }
}
