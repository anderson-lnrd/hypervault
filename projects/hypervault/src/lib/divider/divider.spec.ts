import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { HyperDivider } from './divider';

@Component({
  selector: 'test-divider',
  imports: [HyperDivider],
  template: `
    <hyper-divider />
    <hyper-divider [vertical]="true" />
    <hyper-divider thickness="thick" color="primary" [dashed]="true" />
  `,
})
class TestDividerHost {}

describe('HyperDivider', () => {
  it('should render dividers', async () => {
    await TestBed.configureTestingModule({ imports: [TestDividerHost] }).compileComponents();
    const fixture = TestBed.createComponent(TestDividerHost);
    fixture.detectChanges();
    const dividers = fixture.nativeElement.querySelectorAll('hyper-divider');
    expect(dividers.length).toBe(3);
    expect(dividers[0].classList).toContain('hyper-divider-horizontal');
    expect(dividers[1].classList).toContain('hyper-divider-vertical');
    expect(dividers[2].classList).toContain('hyper-divider-dashed');
  });
});
