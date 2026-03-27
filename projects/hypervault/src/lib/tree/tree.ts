import {
  Component,
  Directive,
  ContentChildren,
  QueryList,
  inject,
  input,
  output,
  signal,
  computed,
  ViewEncapsulation,
  TemplateRef,
  ContentChild,
} from '@angular/core';

// ── Tree Node Data ──

export interface HyperTreeNodeData {
  label: string;
  icon?: string;
  children?: HyperTreeNodeData[];
  disabled?: boolean;
  data?: any;
}

// ── Tree Node Toggle ──

@Directive({
  selector: '[hyperTreeNodeToggle]',
  host: {
    '(click)': 'node.toggle()',
    'class': 'hyper-tree-node-toggle',
    'style': 'cursor: pointer;',
  },
})
export class HyperTreeNodeToggle {
  readonly node = inject(HyperTreeNode);
}

// ── Tree Node ──

@Component({
  selector: 'hyper-tree-node',
  template: `
    <div class="hyper-tree-node-content" [style.padding-left.px]="paddingLeft()">
      @if (expandable()) {
        <button
          class="hyper-tree-toggle-btn"
          (click)="toggle()"
          type="button"
          [attr.aria-expanded]="expanded()"
          [attr.aria-label]="expanded() ? 'Recolher' : 'Expandir'">
          <span class="material-icons hyper-tree-toggle-icon"
                [class.hyper-tree-toggle-open]="expanded()">
            chevron_right
          </span>
        </button>
      } @else {
        <span class="hyper-tree-toggle-spacer"></span>
      }
      @if (icon()) {
        <span class="material-icons hyper-tree-node-icon">{{ icon() }}</span>
      }
      <span class="hyper-tree-node-label">
        <ng-content />
      </span>
    </div>
    @if (expandable() && expanded()) {
      <div class="hyper-tree-node-children" role="group">
        <ng-content select="hyper-tree-node" />
      </div>
    }
  `,
  host: {
    'class': 'hyper-tree-node',
    'role': 'treeitem',
    '[class.hyper-tree-node-expanded]': 'expanded()',
    '[class.hyper-tree-node-disabled]': 'disabled()',
    '[attr.aria-expanded]': 'expandable() ? expanded() : null',
    '(keydown.enter)': 'expandable() && toggle()',
    '(keydown.space)': '$event.preventDefault(); expandable() && toggle()',
    '[tabindex]': 'disabled() ? -1 : 0',
  },
})
export class HyperTreeNode {
  readonly icon = input<string>('');
  readonly expandable = input(false);
  readonly disabled = input(false);
  readonly level = input(0);
  readonly expanded = signal(false);

  readonly nodeToggle = output<boolean>();

  readonly paddingLeft = computed(() => this.level() * 24);

  toggle(): void {
    if (this.disabled()) return;
    this.expanded.update(v => !v);
    this.nodeToggle.emit(this.expanded());
  }

  expand(): void {
    if (!this.disabled()) this.expanded.set(true);
  }

  collapse(): void {
    this.expanded.set(false);
  }
}

// ── Tree ──

@Component({
  selector: 'hyper-tree',
  styleUrl: './tree.scss',
  encapsulation: ViewEncapsulation.None,
  template: `<div class="hyper-tree-inner" role="tree"><ng-content /></div>`,
  host: {
    'class': 'hyper-tree',
    '[class.hyper-tree-dense]': 'dense()',
    '[class.hyper-tree-bordered]': 'bordered()',
    '[class.hyper-tree-interactive]': 'interactive()',
  },
})
export class HyperTree {
  readonly dense = input(false);
  readonly bordered = input(false);
  readonly interactive = input(true);

  @ContentChildren(HyperTreeNode, { descendants: true }) nodes!: QueryList<HyperTreeNode>;

  expandAll(): void {
    this.nodes.forEach(n => n.expand());
  }

  collapseAll(): void {
    this.nodes.forEach(n => n.collapse());
  }
}
