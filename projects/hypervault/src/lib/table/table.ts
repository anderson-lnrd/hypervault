import {
  Component,
  Directive,
  ContentChildren,
  ContentChild,
  QueryList,
  TemplateRef,
  AfterContentInit,
  OnDestroy,
  inject,
  input,
  output,
  signal,
  computed,
  effect,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

// ── Column Definition ──

@Directive({ standalone: true, selector: '[hyperCellDef]' })
export class HyperCellDef {
  constructor(public template: TemplateRef<any>) {}
}

@Directive({ standalone: true, selector: '[hyperHeaderCellDef]' })
export class HyperHeaderCellDef {
  constructor(public template: TemplateRef<any>) {}
}

@Directive({ standalone: true, selector: '[hyperFooterCellDef]' })
export class HyperFooterCellDef {
  constructor(public template: TemplateRef<any>) {}
}

@Directive({ selector: '[hyperColumnDef]' })
export class HyperColumnDef {
  readonly name = input.required<string>({ alias: 'hyperColumnDef' });

  @ContentChild(HyperCellDef) cellDef!: HyperCellDef;
  @ContentChild(HyperHeaderCellDef) headerCellDef!: HyperHeaderCellDef;
  @ContentChild(HyperFooterCellDef) footerCellDef?: HyperFooterCellDef;
}

// ── Sort ──

export type HyperSortDirection = 'asc' | 'desc' | '';

export interface HyperSortEvent {
  active: string;
  direction: HyperSortDirection;
}

@Directive({
  selector: '[hyper-sort-header]',
  host: {
    'class': 'hyper-sort-header',
    '[class.hyper-sort-active]': 'isActive()',
    '[class.hyper-sort-asc]': "isActive() && currentDirection() === 'asc'",
    '[class.hyper-sort-desc]': "isActive() && currentDirection() === 'desc'",
    '(click)': 'toggle()',
    'role': 'button',
    'tabindex': '0',
    '(keydown.enter)': 'toggle()',
    '(keydown.space)': '$event.preventDefault(); toggle()',
  },
})
export class HyperSortHeader {
  readonly columnName = input.required<string>({ alias: 'hyper-sort-header' });

  private readonly table = inject(HyperTable, { optional: true });

  readonly isActive = computed(() => this.table?.activeSortColumn() === this.columnName());
  readonly currentDirection = computed(() => this.isActive() ? (this.table?.activeSortDirection() ?? '') : '');

  toggle(): void {
    this.table?.toggleSort(this.columnName());
  }
}

// ── Table Component ──

@Component({
  selector: 'hyper-table',
  imports: [NgTemplateOutlet],
  templateUrl: './table.html',
  styleUrl: './table.scss',
  host: {
    'class': 'hyper-table-container',
    '[class.hyper-table-bordered]': 'bordered()',
    '[class.hyper-table-striped]': 'striped()',
    '[class.hyper-table-hoverable]': 'hoverable()',
    '[class.hyper-table-dense]': 'dense()',
  },
})
export class HyperTable<T = any> implements AfterContentInit, OnDestroy {
  readonly dataSource = input<T[]>([]);
  readonly bordered = input(false);
  readonly striped = input(false);
  readonly hoverable = input(true);
  readonly dense = input(false);
  readonly stickyHeader = input(false);
  readonly color = input<'primary' | 'secondary'>('primary');

  readonly headerColumns = input<string[]>([], { alias: 'hyperHeaderRowDef' });
  readonly rowColumns = input<string[]>([], { alias: 'hyperRowDef' });
  readonly footerColumns = input<string[]>([]);

  readonly activeSortColumn = signal<string>('');
  readonly activeSortDirection = signal<HyperSortDirection>('');
  readonly sortChange = output<HyperSortEvent>();

  @ContentChildren(HyperColumnDef) columnDefs!: QueryList<HyperColumnDef>;

  private columnMap = new Map<string, HyperColumnDef>();

  readonly renderedRows = signal<T[]>([]);

  constructor() {
    effect(() => {
      this.renderedRows.set(this.dataSource());
    });
  }

  ngAfterContentInit(): void {
    this.buildColumnMap();
    this.columnDefs.changes.subscribe(() => this.buildColumnMap());
  }

  ngOnDestroy(): void {
    this.columnMap.clear();
  }

  private buildColumnMap(): void {
    this.columnMap.clear();
    this.columnDefs.forEach(col => this.columnMap.set(col.name(), col));
  }

  getColumnDef(name: string): HyperColumnDef | undefined {
    return this.columnMap.get(name);
  }

  getCellTemplate(name: string): TemplateRef<any> | null {
    return this.columnMap.get(name)?.cellDef?.template ?? null;
  }

  getHeaderCellTemplate(name: string): TemplateRef<any> | null {
    return this.columnMap.get(name)?.headerCellDef?.template ?? null;
  }

  getFooterCellTemplate(name: string): TemplateRef<any> | null {
    return this.columnMap.get(name)?.footerCellDef?.template ?? null;
  }

  toggleSort(column: string): void {
    let dir: HyperSortDirection;
    if (this.activeSortColumn() === column) {
      const cycle: HyperSortDirection[] = ['asc', 'desc', ''];
      const idx = cycle.indexOf(this.activeSortDirection());
      dir = cycle[(idx + 1) % cycle.length];
    } else {
      dir = 'asc';
    }
    this.activeSortColumn.set(column);
    this.activeSortDirection.set(dir);
    this.sortChange.emit({ active: column, direction: dir });
  }
}

// ── No-data Row ──

@Directive({ standalone: true, selector: '[hyperNoDataRow]' })
export class HyperNoDataRow {}
