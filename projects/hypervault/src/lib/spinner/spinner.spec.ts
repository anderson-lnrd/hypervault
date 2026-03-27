import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { HyperSpinner } from './spinner';

@Component({
  template: `<hyper-spinner [diameter]="32" color="primary" />`,
  imports: [HyperSpinner],
})
class TestHost {}

describe('HyperSpinner', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  it('should create', () => {
    const el = fixture.nativeElement.querySelector('hyper-spinner');
    expect(el).toBeTruthy();
    expect(el.getAttribute('role')).toBe('progressbar');
  });

  it('should render SVG', () => {
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
  });
});
