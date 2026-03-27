import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { HyperTooltip } from './tooltip';

@Component({
  selector: 'test-tooltip',
  imports: [HyperTooltip],
  template: `<button hyperTooltip="Hello World">Hover</button>`,
})
class TestTooltipHost {}

describe('HyperTooltip', () => {
  it('should create host', async () => {
    await TestBed.configureTestingModule({ imports: [TestTooltipHost] }).compileComponents();
    const fixture = TestBed.createComponent(TestTooltipHost);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
