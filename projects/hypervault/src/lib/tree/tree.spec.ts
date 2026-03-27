import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HyperTree, HyperTreeNode } from './tree';

describe('HyperTree', () => {
  let fixture: ComponentFixture<HyperTree>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HyperTree, HyperTreeNode],
    }).compileComponents();

    fixture = TestBed.createComponent(HyperTree);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
