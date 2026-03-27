import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HyperPaginator } from './paginator';

describe('HyperPaginator', () => {
  let fixture: ComponentFixture<HyperPaginator>;
  let component: HyperPaginator;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HyperPaginator] }).compileComponents();
    fixture = TestBed.createComponent(HyperPaginator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute total pages', () => {
    fixture.componentRef.setInput('length', 50);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.detectChanges();
    expect(component.totalPages()).toBe(5);
  });

  it('should navigate pages', () => {
    fixture.componentRef.setInput('length', 30);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.detectChanges();

    component.nextPage();
    expect(component.pageIndex()).toBe(1);

    component.previousPage();
    expect(component.pageIndex()).toBe(0);
  });
});
