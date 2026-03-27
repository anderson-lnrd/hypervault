import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { HyperChip, HyperChipSet, HyperChipInput } from './chip';

@Component({
  selector: 'test-chip',
  imports: [HyperChip, HyperChipSet],
  template: `
    <hyper-chip-set selectionMode="single">
      <hyper-chip label="Angular" />
      <hyper-chip label="React" />
      <hyper-chip label="Vue" />
    </hyper-chip-set>
  `,
})
class TestChipHost {}

@Component({
  selector: 'test-chip-input',
  imports: [HyperChipInput],
  template: `<hyper-chip-input placeholder="Tags..." />`,
})
class TestChipInputHost {}

describe('HyperChip', () => {
  it('should render chips', async () => {
    await TestBed.configureTestingModule({ imports: [TestChipHost] }).compileComponents();
    const fixture = TestBed.createComponent(TestChipHost);
    fixture.detectChanges();
    const chips = fixture.nativeElement.querySelectorAll('.hyper-chip');
    expect(chips.length).toBe(3);
  });
});

describe('HyperChipInput', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({ imports: [TestChipInputHost] }).compileComponents();
    const fixture = TestBed.createComponent(TestChipInputHost);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
