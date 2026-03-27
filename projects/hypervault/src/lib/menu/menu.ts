import {
  Component,
  Directive,
  ElementRef,
  ViewChild,
  inject,
  input,
  output,
  signal,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

// ── Menu Item ──

@Component({
  selector: 'hyper-menu-item',
  template: `
    <span class="hyper-menu-item-inner">
      @if (icon()) {
        <span class="material-icons hyper-menu-item-icon">{{ icon() }}</span>
      }
      <span class="hyper-menu-item-label"><ng-content /></span>
    </span>
  `,
  host: {
    'class': 'hyper-menu-item',
    'role': 'menuitem',
    '[class.hyper-menu-item-disabled]': 'disabled()',
    '[attr.disabled]': 'disabled() || null',
    '[tabindex]': 'disabled() ? -1 : 0',
    '(keydown.enter)': '!disabled() && activated.emit()',
    '(keydown.space)': '$event.preventDefault(); !disabled() && activated.emit()',
    '(click)': '!disabled() && activated.emit()',
  },
})
export class HyperMenuItem {
  readonly icon = input<string>('');
  readonly disabled = input(false);
  readonly activated = output<void>();
}

// ── Menu Divider ──

@Directive({
  selector: 'hyper-menu-divider',
  host: { 'class': 'hyper-menu-divider', 'role': 'separator' },
})
export class HyperMenuDivider {}

// ── Menu Group ──

@Component({
  selector: 'hyper-menu-group',
  template: `
    @if (label()) {
      <div class="hyper-menu-group-label">{{ label() }}</div>
    }
    <ng-content />
  `,
  host: { 'class': 'hyper-menu-group', 'role': 'group' },
})
export class HyperMenuGroup {
  readonly label = input<string>('');
}

// ── Menu Panel ──

@Component({
  selector: 'hyper-menu',
  styleUrl: './menu.scss',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div #panel class="hyper-menu-panel" role="menu">
      <ng-content />
    </div>
  `,
  host: { 'style': 'display: none' },
})
export class HyperMenu {
  readonly xPosition = input<'before' | 'after'>('after');
  readonly yPosition = input<'above' | 'below'>('below');
  readonly hasBackdrop = input(true);
  readonly closed = output<void>();

  /** @internal */
  @ViewChild('panel', { static: true }) _panelEl!: ElementRef<HTMLElement>;
  private readonly hostEl = inject(ElementRef);

  /** @internal — restores panel back inside host */
  _restorePanel(): void {
    const panel = this._panelEl.nativeElement;
    panel.style.display = 'none';
    panel.style.top = '';
    panel.style.left = '';
    panel.style.bottom = '';
    panel.style.right = '';
    this.hostEl.nativeElement.appendChild(panel);
  }
}

// ── Menu Trigger ──

@Directive({
  selector: '[hyperMenuTriggerFor]',
  host: {
    '(click)': 'toggle()',
    '(keydown.enter)': 'open()',
    '(keydown.space)': '$event.preventDefault(); open()',
    '[attr.aria-haspopup]': '"menu"',
    '[attr.aria-expanded]': 'isOpen()',
  },
})
export class HyperMenuTrigger implements OnDestroy {
  readonly menu = input.required<HyperMenu>({ alias: 'hyperMenuTriggerFor' });

  private readonly el = inject(ElementRef);
  private readonly doc = inject(DOCUMENT);
  private backdrop: HTMLElement | null = null;
  private keydownHandler: ((e: KeyboardEvent) => void) | null = null;
  private clickListeners: (() => void)[] = [];

  readonly isOpen = signal(false);

  toggle(): void {
    this.isOpen() ? this.close() : this.open();
  }

  open(): void {
    if (this.isOpen()) return;
    const menuComp = this.menu();
    const panel = menuComp._panelEl.nativeElement;

    // Create backdrop
    if (menuComp.hasBackdrop()) {
      this.backdrop = this.doc.createElement('div');
      this.backdrop.className = 'hyper-menu-backdrop';
      this.backdrop.addEventListener('click', () => this.close());
      this.doc.body.appendChild(this.backdrop);
    }

    // Move panel to body and show
    this.doc.body.appendChild(panel);
    panel.style.display = '';
    this.positionPanel(panel);

    // Close on item click
    const items = panel.querySelectorAll('.hyper-menu-item:not(.hyper-menu-item-disabled)');
    items.forEach((item: Element) => {
      const handler = () => this.close();
      item.addEventListener('click', handler, { once: true });
      this.clickListeners.push(() => item.removeEventListener('click', handler));
    });

    // Keyboard navigation
    this.keydownHandler = (e: KeyboardEvent) => this.handleKeydown(e, panel);
    panel.addEventListener('keydown', this.keydownHandler);

    // Focus first item
    requestAnimationFrame(() => {
      const first = panel.querySelector('.hyper-menu-item:not(.hyper-menu-item-disabled)') as HTMLElement;
      first?.focus();
    });

    this.isOpen.set(true);
  }

  close(): void {
    if (!this.isOpen()) return;
    const menuComp = this.menu();
    const panel = menuComp._panelEl.nativeElement;

    // Remove event listeners
    if (this.keydownHandler) {
      panel.removeEventListener('keydown', this.keydownHandler);
      this.keydownHandler = null;
    }
    this.clickListeners.forEach(unsub => unsub());
    this.clickListeners = [];

    // Remove backdrop
    this.backdrop?.remove();
    this.backdrop = null;

    // Restore panel
    menuComp._restorePanel();

    this.isOpen.set(false);
    menuComp.closed.emit();
  }

  ngOnDestroy(): void {
    this.close();
  }

  private positionPanel(panel: HTMLElement): void {
    const trigger = this.el.nativeElement.getBoundingClientRect();
    const menuComp = this.menu();
    const gap = 4;

    // Reset all positions
    panel.style.top = '';
    panel.style.bottom = '';
    panel.style.left = '';
    panel.style.right = '';

    // Y position
    if (menuComp.yPosition() === 'above') {
      panel.style.bottom = `${window.innerHeight - trigger.top + gap}px`;
    } else {
      panel.style.top = `${trigger.bottom + gap}px`;
    }

    // X position
    if (menuComp.xPosition() === 'before') {
      panel.style.right = `${window.innerWidth - trigger.right}px`;
    } else {
      panel.style.left = `${trigger.left}px`;
    }

    // Flip if overflows viewport
    requestAnimationFrame(() => {
      const rect = panel.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        panel.style.left = 'auto';
        panel.style.right = '4px';
      }
      if (rect.bottom > window.innerHeight) {
        panel.style.top = 'auto';
        panel.style.bottom = `${window.innerHeight - trigger.top + gap}px`;
      }
      if (rect.left < 0) {
        panel.style.left = '4px';
        panel.style.right = 'auto';
      }
      if (rect.top < 0) {
        panel.style.top = `${trigger.bottom + gap}px`;
        panel.style.bottom = 'auto';
      }
    });
  }

  private handleKeydown(e: KeyboardEvent, panel: HTMLElement): void {
    const items = Array.from(
      panel.querySelectorAll('.hyper-menu-item:not(.hyper-menu-item-disabled)')
    ) as HTMLElement[];
    const current = items.indexOf(this.doc.activeElement as HTMLElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(current + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[current > 0 ? current - 1 : items.length - 1]?.focus();
    } else if (e.key === 'Escape') {
      this.close();
      (this.el.nativeElement as HTMLElement).focus();
    }
  }
}
