import { Component, signal } from '@angular/core';
import { HyperPaginator, HyperPageEvent } from 'hypervault/paginator';
import {
  HyperTable,
  HyperColumnDef,
  HyperCellDef,
  HyperHeaderCellDef,
  HyperSortHeader,
  HyperNoDataRow,
  HyperSortEvent,
} from 'hypervault/table';
interface Person {
  id: number;
  name: string;
  role: string;
  level: number;
}

const ALL_DATA: Person[] = [
  { id: 1, name: 'Ana Costa', role: 'Frontend', level: 3 },
  { id: 2, name: 'Bruno Lima', role: 'Backend', level: 5 },
  { id: 3, name: 'Carla Souza', role: 'DevOps', level: 4 },
  { id: 4, name: 'Diego Mendes', role: 'Design', level: 2 },
  { id: 5, name: 'Elena Rocha', role: 'Frontend', level: 4 },
  { id: 6, name: 'Felipe Alves', role: 'Backend', level: 3 },
  { id: 7, name: 'Gabi Nunes', role: 'QA', level: 2 },
  { id: 8, name: 'Hugo Reis', role: 'Frontend', level: 5 },
  { id: 9, name: 'Iris Pinto', role: 'Backend', level: 1 },
  { id: 10, name: 'Joao Prado', role: 'DevOps', level: 3 },
  { id: 11, name: 'Karen Dias', role: 'Design', level: 4 },
  { id: 12, name: 'Leo Campos', role: 'QA', level: 2 },
];

@Component({
  selector: 'app-table-page',
  imports: [
    HyperTable, HyperColumnDef, HyperCellDef, HyperHeaderCellDef,
    HyperSortHeader, HyperNoDataRow, HyperPaginator,
  ],
  templateUrl: './table-page.html',
})
export class TablePage {
  readonly columns = ['id', 'name', 'role', 'level'];
  readonly allData = ALL_DATA;
  readonly data = signal<Person[]>(ALL_DATA.slice(0, 5));
  readonly pageSize = signal(5);
  readonly emptyData = signal<Person[]>([]);

  readonly sortedData = signal<Person[]>([...ALL_DATA]);

  onSort(event: HyperSortEvent): void {
    const sorted = [...ALL_DATA];
    if (event.direction) {
      const dir = event.direction === 'asc' ? 1 : -1;
      sorted.sort((a, b) => {
        const va = (a as any)[event.active];
        const vb = (b as any)[event.active];
        return (va < vb ? -1 : va > vb ? 1 : 0) * dir;
      });
    }
    this.sortedData.set(sorted);
  }

  onPage(event: HyperPageEvent): void {
    const start = event.pageIndex * event.pageSize;
    this.pageSize.set(event.pageSize);
    this.data.set(ALL_DATA.slice(start, start + event.pageSize));
  }
}
