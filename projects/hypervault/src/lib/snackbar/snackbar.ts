import {
  Component,
  Injectable,
  InjectionToken,
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
  computed,
  createComponent,
  inject,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

// ── Types ──

export type HyperSnackbarVariant = 'default' | 'success' | 'warning' | 'error';
export type HyperSnackbarPosition =
  | 'top-left' | 'top-center' | 'top-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface HyperSnackbarConfig {
  /** Message text. */
  message: string;
  /** Optional action button label. */
  action?: string;
  /** Auto-dismiss duration in ms (0 = manual only). Default: 4000. */
  duration?: number;
  /** Visual variant. Default: 'default'. */
  variant?: HyperSnackbarVariant;
  /** Screen position. Default: 'bottom-center'. */
  position?: HyperSnackbarPosition;
  /** Material icon name. */
  icon?: string;
}

export interface HyperSnackbarRef {
  /** Dismiss programmatically. */
  dismiss: () => void;
  /** Resolves when dismissed. True if action was clicked. */
  afterDismissed: () => Promise<boolean>;
}

/** Global snackbar defaults. */
export interface HyperSnackbarDefaults {
  duration?: number;
  position?: HyperSnackbarPosition;
}

export const HYPER_SNACKBAR_DEFAULTS = new InjectionToken<HyperSnackbarDefaults>(
  'HYPER_SNACKBAR_DEFAULTS',
);

// ── Component (internal) ──

@Component({
  selector: 'hyper-snackbar',
  template: `
    <div class="hyper-snackbar-inner" [class]="variantClass()" [class.hyper-snackbar-exiting]="exiting()">
      @if (icon()) {
        <span class="material-icons hyper-snackbar-icon">{{ icon() }}</span>
      }
      <span class="hyper-snackbar-message">{{ message() }}</span>
      @if (action()) {
        <button class="hyper-snackbar-action" (click)="onAction()">{{ action() }}</button>
      }
      <button class="hyper-snackbar-close" aria-label="Fechar" (click)="onClose()">
        <span class="material-icons">close</span>
      </button>
    </div>
  `,
  styleUrl: './snackbar.scss',
  host: {
    'class': 'hyper-snackbar-host',
    '[class]': 'positionClass()',
  },
})
export class HyperSnackbarComponent {
  readonly message = signal('');
  readonly action = signal<string | undefined>(undefined);
  readonly icon = signal<string | undefined>(undefined);
  readonly variant = signal<HyperSnackbarVariant>('default');
  readonly position = signal<HyperSnackbarPosition>('bottom-center');
  readonly exiting = signal(false);

  /** @internal */
  _onDismiss!: (actionClicked: boolean) => void;

  readonly variantClass = computed(() => `hyper-snackbar-${this.variant()}`);
  readonly positionClass = computed(() => `hyper-snackbar-host hyper-snackbar-pos-${this.position()}`);

  onAction(): void {
    this._onDismiss(true);
  }

  onClose(): void {
    this._onDismiss(false);
  }
}

// ── Service ──

@Injectable({ providedIn: 'root' })
export class HyperSnackbar {
  private readonly appRef = inject(ApplicationRef);
  private readonly injector = inject(EnvironmentInjector);
  private readonly document = inject(DOCUMENT);
  private readonly defaults = inject(HYPER_SNACKBAR_DEFAULTS, { optional: true });

  private activeRef: ComponentRef<HyperSnackbarComponent> | null = null;
  private dismissTimeout: ReturnType<typeof setTimeout> | null = null;

  /** Open a snackbar with the given config. */
  open(config: HyperSnackbarConfig): HyperSnackbarRef {
    // Dismiss previous
    this.dismissCurrent(false);

    const duration = config.duration ?? this.defaults?.duration ?? 4000;
    const position = config.position ?? this.defaults?.position ?? 'bottom-center';

    const compRef = createComponent(HyperSnackbarComponent, {
      environmentInjector: this.injector,
    });

    const instance = compRef.instance;
    instance.message.set(config.message);
    instance.action.set(config.action);
    instance.icon.set(config.icon);
    instance.variant.set(config.variant ?? 'default');
    instance.position.set(position);

    let resolvePromise: (actionClicked: boolean) => void;
    const afterDismissed = new Promise<boolean>((resolve) => {
      resolvePromise = resolve;
    });

    const dismiss = (actionClicked: boolean) => {
      if (this.activeRef !== compRef) return;
      instance.exiting.set(true);
      // Wait for exit animation
      setTimeout(() => {
        this.cleanup(compRef);
        resolvePromise(actionClicked);
      }, 200);
    };

    instance._onDismiss = dismiss;
    this.activeRef = compRef;

    this.appRef.attachView(compRef.hostView);
    this.document.body.appendChild(compRef.location.nativeElement);

    if (duration > 0) {
      this.dismissTimeout = setTimeout(() => dismiss(false), duration);
    }

    return {
      dismiss: () => dismiss(false),
      afterDismissed: () => afterDismissed,
    };
  }

  /** Shorthand: success snackbar. */
  success(message: string, config?: Partial<HyperSnackbarConfig>): HyperSnackbarRef {
    return this.open({ ...config, message, variant: 'success', icon: config?.icon ?? 'check_circle' });
  }

  /** Shorthand: error snackbar. */
  error(message: string, config?: Partial<HyperSnackbarConfig>): HyperSnackbarRef {
    return this.open({ ...config, message, variant: 'error', icon: config?.icon ?? 'error' });
  }

  /** Shorthand: warning snackbar. */
  warning(message: string, config?: Partial<HyperSnackbarConfig>): HyperSnackbarRef {
    return this.open({ ...config, message, variant: 'warning', icon: config?.icon ?? 'warning' });
  }

  private dismissCurrent(actionClicked: boolean): void {
    if (this.dismissTimeout) {
      clearTimeout(this.dismissTimeout);
      this.dismissTimeout = null;
    }
    if (this.activeRef) {
      this.cleanup(this.activeRef);
    }
  }

  private cleanup(ref: ComponentRef<HyperSnackbarComponent>): void {
    if (this.dismissTimeout) {
      clearTimeout(this.dismissTimeout);
      this.dismissTimeout = null;
    }
    try {
      this.appRef.detachView(ref.hostView);
      ref.location.nativeElement.remove();
      ref.destroy();
    } catch { /* already cleaned */ }
    if (this.activeRef === ref) {
      this.activeRef = null;
    }
  }
}
