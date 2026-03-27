import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { HyperTable, HyperColumnDef, HyperCellDef, HyperHeaderCellDef, HyperSortHeader, HyperNoDataRow } from './table';

@Component({
  imports: [HyperTable, HyperColumnDef, HyperCellDef, HyperHeaderCellDef],
  template: `
    <hyper-table [dataSource]="data" [hyperHeaderRowDef]="['name']" [hyperRowDef]="['name']">
      <ng-container hyperColumnDef="name">
        <th *hyperHeaderCellDef>Name</th>
        <td *hyperCellDef="let row">{{ row.name }}</td>
      </ng-container>
    </hyper-table>
  `,
})
class TestTableHost {
  data = [{ name: 'Alice' }, { name: 'Bob' }];
}

describe('HyperTable', () => {
  let fixture: ComponentFixture<TestTableHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestTableHost] }).compileComponents();
    fixture = TestBed.createComponent(TestTableHost);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render rows', () => {
    const rows = fixture.nativeElement.querySelectorAll('.hyper-row');
    expect(rows.length).toBe(2);
  });
});
