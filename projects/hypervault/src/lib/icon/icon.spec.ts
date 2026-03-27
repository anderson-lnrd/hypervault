import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { HyperIcon } from './icon';

@Component({
  template: '<hyper-icon>home</hyper-icon>',
  imports: [HyperIcon],
})
class TestHost {}

describe('HyperIcon', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  it('should create', () => {
    const iconEl = fixture.nativeElement.querySelector('hyper-icon');
    expect(iconEl).toBeTruthy();
  });

  it('should render icon text content', () => {
    const iconEl: HTMLElement = fixture.nativeElement.querySelector('hyper-icon');
    expect(iconEl.textContent?.trim()).toBe('home');
  });

  it('should have role="img"', () => {
    const iconEl: HTMLElement = fixture.nativeElement.querySelector('hyper-icon');
    expect(iconEl.getAttribute('role')).toBe('img');
  });

  it('should have aria-hidden="true"', () => {
    const iconEl: HTMLElement = fixture.nativeElement.querySelector('hyper-icon');
    expect(iconEl.getAttribute('aria-hidden')).toBe('true');
  });
});
