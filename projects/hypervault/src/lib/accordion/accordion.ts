import {
  Component,
  ContentChildren,
  Directive,
  QueryList,
  AfterContentInit,
  computed,
  contentChild,
  inject,
  input,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

// ── Accordion Header ──

/** Projects a custom header template inside an expansion panel. */
@Directive({ selector: '[hyper-accordion-header]' })
export class HyperAccordionHeader {
  readonly template = inject(TemplateRef);
}

// ── Expansion Panel ──

@Component({
  selector: 'hyper-expansion-panel',
  imports: [NgTemplateOutlet],
  templateUrl: './accordion.html',
  styleUrl: './accordion.scss',
  host: {
    'class': 'hyper-expansion-panel',
    '[class.hyper-panel-expanded]': 'expanded()',
    '[class.hyper-panel-disabled]': 'disabled()',
  },
})
export class HyperExpansionPanel {
  /** Whether the panel is expanded. */
  readonly expanded = signal(false);

  /** Panel title text. */
  readonly title = input('');

  /** Optional description shown beside the title. */
  readonly description = input<string | undefined>(undefined);

  /** Material icon shown before the title. */
  readonly icon = input<string | undefined>(undefined);

  /** Whether the panel is disabled. */
  readonly disabled = input(false);

  /** Hide the toggle icon. */
  readonly hideToggle = input(false);

  /** Emitted when the panel opens. */
  readonly opened = output<void>();

  /** Emitted when the panel closes. */
  readonly closed = output<void>();

  /** Custom header template. */
  readonly customHeader = contentChild(HyperAccordionHeader);

  /** @internal — set by parent HyperAccordion. */
  _parent: HyperAccordion | null = null;

  toggle(): void {
    if (this.disabled()) return;
    if (this.expanded()) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    if (this.disabled() || this.expanded()) return;
    // If parent is single-expand, close others
    this._parent?.closeOthers(this);
    this.expanded.set(true);
    this.opened.emit();
  }

  close(): void {
    if (!this.expanded()) return;
    this.expanded.set(false);
    this.closed.emit();
  }
}

// ── Accordion ──

@Component({
  selector: 'hyper-accordion',
  template: '<ng-content />',
  host: {
    'class': 'hyper-accordion',
    '[class]': 'hostClasses()',
  },
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      gap: 0;
    }
    :host(.hyper-accordion-spaced) {
      gap: 0.5rem;
    }
  `],
})
export class HyperAccordion implements AfterContentInit {
  /** Allow only one panel open at a time. */
  readonly multi = input(false);

  /** Add spacing between panels. */
  readonly spaced = input(false);

  /** Bordered style on panels. */
  readonly bordered = input(true);

  @ContentChildren(HyperExpansionPanel) panels!: QueryList<HyperExpansionPanel>;

  readonly hostClasses = computed(() => {
    const classes = ['hyper-accordion'];
    if (this.spaced()) classes.push('hyper-accordion-spaced');
    if (this.bordered()) classes.push('hyper-accordion-bordered');
    return classes.join(' ');
  });

  ngAfterContentInit(): void {
    this.registerPanels();
    this.panels.changes.subscribe(() => this.registerPanels());
  }

  /** @internal — close all panels except the given one (single-expand mode). */
  closeOthers(except: HyperExpansionPanel): void {
    if (this.multi()) return;
    this.panels.forEach(p => {
      if (p !== except && p.expanded()) {
        p.close();
      }
    });
  }

  private registerPanels(): void {
    this.panels.forEach(p => (p._parent = this));
  }
}
