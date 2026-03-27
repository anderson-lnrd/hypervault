import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { HyperList, HyperListItem, HyperListDivider, HyperListSubheader } from './list';

@Component({
  selector: 'test-list',
  imports: [HyperList, HyperListItem, HyperListDivider, HyperListSubheader],
  template: `
    <hyper-list [bordered]="true">
      <hyper-list-subheader>Grupo</hyper-list-subheader>
      <hyper-list-item>Item 1</hyper-list-item>
      <hyper-list-divider />
      <hyper-list-item>Item 2</hyper-list-item>
    </hyper-list>
  `,
})
class TestListHost {}

describe('HyperList', () => {
  it('should render list items', async () => {
    await TestBed.configureTestingModule({ imports: [TestListHost] }).compileComponents();
    const fixture = TestBed.createComponent(TestListHost);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('hyper-list-item');
    expect(items.length).toBe(2);
  });
});
