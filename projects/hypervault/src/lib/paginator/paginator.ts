import {
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';

export interface HyperPageEvent {
  pageIndex: number;
  pageSize: number;
  length: number;
  previousPageIndex: number;
}

@Component({
  selector: 'hyper-paginator',
  templateUrl: './paginator.html',
  styleUrl: './paginator.scss',
  host: {
    'class': 'hyper-paginator',
    '[class.hyper-paginator-disabled]': 'disabled()',
  },
})
export class HyperPaginator {
  readonly length = input(0);
  readonly pageSize = input(10);
  readonly pageSizeOptions = input<number[]>([5, 10, 25, 50]);
  readonly showFirstLastButtons = input(false);
  readonly disabled = input(false);
  readonly color = input<'primary' | 'secondary'>('primary');
  readonly hidePageSize = input(false);

  readonly pageIndex = signal(0);
  readonly page = output<HyperPageEvent>();

  readonly totalPages = computed(() => {
    const size = this.pageSize();
    return size > 0 ? Math.ceil(this.length() / size) : 0;
  });

  readonly rangeLabel = computed(() => {
    const len = this.length();
    if (len === 0) return '0 de 0';
    const start = this.pageIndex() * this.pageSize() + 1;
    const end = Math.min((this.pageIndex() + 1) * this.pageSize(), len);
    return `${start}–${end} de ${len}`;
  });

  readonly hasPrevious = computed(() => this.pageIndex() > 0);
  readonly hasNext = computed(() => this.pageIndex() < this.totalPages() - 1);

  firstPage(): void {
    if (this.disabled() || !this.hasPrevious()) return;
    this.setPage(0);
  }

  previousPage(): void {
    if (this.disabled() || !this.hasPrevious()) return;
    this.setPage(this.pageIndex() - 1);
  }

  nextPage(): void {
    if (this.disabled() || !this.hasNext()) return;
    this.setPage(this.pageIndex() + 1);
  }

  lastPage(): void {
    if (this.disabled() || !this.hasNext()) return;
    this.setPage(this.totalPages() - 1);
  }

  onPageSizeChange(event: Event): void {
    const value = +(event.target as HTMLSelectElement).value;
    const prev = this.pageIndex();
    this.pageIndex.set(0);
    this.page.emit({ pageIndex: 0, pageSize: value, length: this.length(), previousPageIndex: prev });
  }

  private setPage(index: number): void {
    const prev = this.pageIndex();
    this.pageIndex.set(index);
    this.page.emit({ pageIndex: index, pageSize: this.pageSize(), length: this.length(), previousPageIndex: prev });
  }
}
