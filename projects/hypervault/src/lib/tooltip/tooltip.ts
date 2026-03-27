import {
  Directive,
  Component,
  ElementRef,
  ApplicationRef,
  ComponentRef,
  EmbeddedViewRef,
  Injector,
  OnDestroy,
  Renderer2,
  ViewContainerRef,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type HyperTooltipPosition = 'above' | 'below' | 'left' | 'right';

// ── Internal Tooltip Component ──

@Component({
  selector: 'hyper-tooltip-overlay',
  template: `<div class="hyper-tooltip" [class]="posClass()" role="tooltip">{{ text() }}</div>`,
  styles: [`
    :host {
      position: fixed;
      z-index: 10000;
      pointer-events: none;
    }
    .hyper-tooltip {
      font-family: var(--font-sans, sans-serif);
      font-size: 0.75rem;
      font-weight: 600;
      line-height: 1.3;
      color: var(--background, #111);
      background: var(--foreground, #e0e0e0);
      padding: 0.35rem 0.6rem;
      border: 2px solid var(--background, #111);
      box-shadow: 2px 2px 0 var(--background, #111);
      max-width: 220px;
      word-wrap: break-word;
      animation: hyperTooltipIn 0.12s ease;
    }
    @keyframes hyperTooltipIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `],
})
export class HyperTooltipComponent {
  readonly text = signal('');
  readonly posClass = signal('');
}

// ── Tooltip Directive ──

@Directive({
  selector: '[hyperTooltip]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(focus)': 'onMouseEnter()',
    '(blur)': 'onMouseLeave()',
  },
})
export class HyperTooltip implements OnDestroy {
  readonly hyperTooltip = input.required<string>();
  readonly tooltipPosition = input<HyperTooltipPosition>('above');
  readonly tooltipShowDelay = input(200);
  readonly tooltipHideDelay = input(0);
  readonly tooltipDisabled = input(false);

  private readonly elRef = inject(ElementRef);
  private readonly vcRef = inject(ViewContainerRef);
  private readonly document = inject(DOCUMENT);

  private compRef: ComponentRef<HyperTooltipComponent> | null = null;
  private showTimeout: ReturnType<typeof setTimeout> | null = null;
  private hideTimeout: ReturnType<typeof setTimeout> | null = null;

  onMouseEnter(): void {
    if (this.tooltipDisabled() || !this.hyperTooltip()) return;
    this.clearTimeouts();
    this.showTimeout = setTimeout(() => this.show(), this.tooltipShowDelay());
  }

  onMouseLeave(): void {
    this.clearTimeouts();
    this.hideTimeout = setTimeout(() => this.hide(), this.tooltipHideDelay());
  }

  private show(): void {
    if (this.compRef) return;

    this.compRef = this.vcRef.createComponent(HyperTooltipComponent);
    this.compRef.instance.text.set(this.hyperTooltip());

    const tooltipEl = (this.compRef.hostView as EmbeddedViewRef<unknown>).rootNodes[0] as HTMLElement;
    this.document.body.appendChild(tooltipEl);

    // Position after render
    requestAnimationFrame(() => this.positionTooltip(tooltipEl));
  }

  private positionTooltip(tooltipEl: HTMLElement): void {
    const hostRect = this.elRef.nativeElement.getBoundingClientRect();
    const tipRect = tooltipEl.getBoundingClientRect();
    const gap = 8;

    let top = 0;
    let left = 0;
    let pos = this.tooltipPosition();

    // Calculate position
    switch (pos) {
      case 'above':
        top = hostRect.top - tipRect.height - gap;
        left = hostRect.left + (hostRect.width - tipRect.width) / 2;
        break;
      case 'below':
        top = hostRect.bottom + gap;
        left = hostRect.left + (hostRect.width - tipRect.width) / 2;
        break;
      case 'left':
        top = hostRect.top + (hostRect.height - tipRect.height) / 2;
        left = hostRect.left - tipRect.width - gap;
        break;
      case 'right':
        top = hostRect.top + (hostRect.height - tipRect.height) / 2;
        left = hostRect.right + gap;
        break;
    }

    // Flip if out of viewport
    if (top < 0 && pos === 'above') {
      top = hostRect.bottom + gap;
      pos = 'below';
    } else if (top + tipRect.height > window.innerHeight && pos === 'below') {
      top = hostRect.top - tipRect.height - gap;
      pos = 'above';
    }
    if (left < 0) left = gap;
    if (left + tipRect.width > window.innerWidth) left = window.innerWidth - tipRect.width - gap;

    tooltipEl.style.top = `${top}px`;
    tooltipEl.style.left = `${left}px`;
    this.compRef?.instance.posClass.set(`hyper-tooltip-${pos}`);
  }

  private hide(): void {
    if (this.compRef) {
      const tooltipEl = (this.compRef.hostView as EmbeddedViewRef<unknown>).rootNodes[0] as HTMLElement;
      tooltipEl.remove();
      this.compRef.destroy();
      this.compRef = null;
    }
  }

  private clearTimeouts(): void {
    if (this.showTimeout) { clearTimeout(this.showTimeout); this.showTimeout = null; }
    if (this.hideTimeout) { clearTimeout(this.hideTimeout); this.hideTimeout = null; }
  }

  ngOnDestroy(): void {
    this.clearTimeouts();
    this.hide();
  }
}
