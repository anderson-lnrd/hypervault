import {
  Component,
  Directive,
  Injectable,
  InjectionToken,
  Injector,
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
  EmbeddedViewRef,
  Type,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
  createComponent,
  inject,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject, Observable } from 'rxjs';

// ── Injection Token ──

export const HYPER_DIALOG_DATA = new InjectionToken<unknown>('HYPER_DIALOG_DATA');

// ── Config ──

export interface HyperDialogConfig<D = unknown> {
  width?: string;
  maxWidth?: string;
  height?: string;
  maxHeight?: string;
  data?: D;
  disableClose?: boolean;
  hasBackdrop?: boolean;
  panelClass?: string | string[];
  autoFocus?: boolean;
}

// ── Ref ──

export class HyperDialogRef<R = unknown> {
  /** @internal */
  _containerRef: ComponentRef<HyperDialogContainer> | null = null;
  /** @internal */
  _hostEl: HTMLElement | null = null;

  private readonly _afterClosed = new Subject<R | undefined>();
  private readonly _backdropClick = new Subject<void>();

  close(result?: R): void {
    this._afterClosed.next(result);
    this._afterClosed.complete();
    this._backdropClick.complete();
    this._hostEl?.remove();
    this._containerRef?.destroy();
    this._containerRef = null;
  }

  afterClosed(): Observable<R | undefined> {
    return this._afterClosed.asObservable();
  }

  backdropClick(): Observable<void> {
    return this._backdropClick.asObservable();
  }

  /** @internal */
  _emitBackdropClick(): void {
    this._backdropClick.next();
  }
}

// ── Container Component ──

@Component({
  selector: 'hyper-dialog-container',
  template: `
    <div class="hyper-dialog-backdrop"
         [class.hyper-dialog-backdrop-visible]="hasBackdrop"
         (click)="onBackdropClick()"></div>
    <div class="hyper-dialog-panel"
         [style.width]="config.width ?? '480px'"
         [style.max-width]="config.maxWidth ?? '90vw'"
         [style.height]="config.height ?? null"
         [style.max-height]="config.maxHeight ?? '85vh'"
         role="dialog"
         aria-modal="true"
         tabindex="-1"
         #panel
         (keydown.escape)="onEsc()">
      <ng-template #outlet />
    </div>
  `,
  styles: [`
    :host {
      position: fixed;
      inset: 0;
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: hyperDialogFadeIn 0.15s ease;
    }
    @keyframes hyperDialogFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .hyper-dialog-backdrop {
      position: fixed;
      inset: 0;
    }
    .hyper-dialog-backdrop-visible {
      background: rgba(0, 0, 0, 0.55);
    }
    .hyper-dialog-panel {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      background: var(--card, #1a1a1a);
      border: var(--border-width, 4px) solid var(--border, #333);
      box-shadow: var(--shadow-offset, 4px) var(--shadow-offset, 4px) 0 var(--border, #333);
      overflow: hidden;
      outline: none;
      animation: hyperDialogSlideIn 0.2s ease;
    }
    @keyframes hyperDialogSlideIn {
      from { opacity: 0; transform: translateY(-12px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `],
})
export class HyperDialogContainer implements AfterViewInit {
  @ViewChild('outlet', { read: ViewContainerRef }) outlet!: ViewContainerRef;
  @ViewChild('panel') panelEl!: { nativeElement: HTMLElement };

  config: HyperDialogConfig = {};
  hasBackdrop = true;
  dialogRef!: HyperDialogRef;
  componentType!: Type<unknown>;
  componentInjector!: Injector;

  ngAfterViewInit(): void {
    this.outlet.createComponent(this.componentType, { injector: this.componentInjector });

    if (this.config.autoFocus !== false) {
      setTimeout(() => {
        const focusable = this.panelEl.nativeElement.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        (focusable ?? this.panelEl.nativeElement).focus();
      }, 50);
    }
  }

  onBackdropClick(): void {
    this.dialogRef._emitBackdropClick();
    if (!this.config.disableClose) {
      this.dialogRef.close();
    }
  }

  onEsc(): void {
    if (!this.config.disableClose) {
      this.dialogRef.close();
    }
  }
}

// ── Dialog Service ──

@Injectable({ providedIn: 'root' })
export class HyperDialog {
  private readonly appRef = inject(ApplicationRef);
  private readonly envInjector = inject(EnvironmentInjector);
  private readonly injector = inject(Injector);
  private readonly document = inject(DOCUMENT);

  open<T, R = unknown, D = unknown>(
    component: Type<T>,
    config: HyperDialogConfig<D> = {},
  ): HyperDialogRef<R> {
    const dialogRef = new HyperDialogRef<R>();

    const componentInjector = Injector.create({
      providers: [
        { provide: HyperDialogRef, useValue: dialogRef },
        { provide: HYPER_DIALOG_DATA, useValue: config.data ?? null },
      ],
      parent: this.injector,
    });

    const containerRef = createComponent(HyperDialogContainer, {
      environmentInjector: this.envInjector,
      elementInjector: this.injector,
    });

    containerRef.instance.config = config;
    containerRef.instance.hasBackdrop = config.hasBackdrop !== false;
    containerRef.instance.dialogRef = dialogRef as HyperDialogRef<unknown>;
    containerRef.instance.componentType = component;
    containerRef.instance.componentInjector = componentInjector;

    dialogRef._containerRef = containerRef;

    this.appRef.attachView(containerRef.hostView);
    const hostEl = (containerRef.hostView as EmbeddedViewRef<unknown>).rootNodes[0] as HTMLElement;
    this.document.body.appendChild(hostEl);
    dialogRef._hostEl = hostEl;

    containerRef.changeDetectorRef.detectChanges();

    return dialogRef;
  }
}

// ── Layout Directives ──

@Directive({
  selector: 'hyper-dialog-title, [hyper-dialog-title]',
  host: {
    'class': 'hyper-dialog-title',
    'style': `
      display: block;
      padding: 1.25rem 1.5rem 0.5rem;
      font-family: var(--font-sans, sans-serif);
      font-size: 1.15rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--foreground, #fff);
    `,
  },
})
export class HyperDialogTitle {}

@Directive({
  selector: 'hyper-dialog-content, [hyper-dialog-content]',
  host: {
    'class': 'hyper-dialog-content',
    'style': `
      display: block;
      padding: 0.75rem 1.5rem;
      overflow-y: auto;
      flex: 1;
      font-family: var(--font-sans, sans-serif);
      font-size: 0.85rem;
      line-height: 1.6;
      color: var(--muted-foreground, #aaa);
    `,
  },
})
export class HyperDialogContent {}

@Directive({
  selector: 'hyper-dialog-actions, [hyper-dialog-actions]',
  host: {
    'class': 'hyper-dialog-actions',
    'style': `
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem 1.25rem;
    `,
  },
})
export class HyperDialogActions {}
