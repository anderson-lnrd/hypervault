import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { HyperProgressBar } from './progress-bar';

@Component({
  template: `<hyper-progress-bar [value]="60" color="primary" />`,
  imports: [HyperProgressBar],
})
class TestHost {}

describe('HyperProgressBar', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  it('should create', () => {
    const el = fixture.nativeElement.querySelector('hyper-progress-bar');
    expect(el).toBeTruthy();
    expect(el.getAttribute('role')).toBe('progressbar');
  });

  it('should set aria-valuenow', () => {
    const el = fixture.nativeElement.querySelector('hyper-progress-bar');
    expect(el.getAttribute('aria-valuenow')).toBe('60');
  });
});
