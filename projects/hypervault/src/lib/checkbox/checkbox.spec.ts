import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { HyperCheckbox } from './checkbox';

// ── Test hosts ──

@Component({
  template: '<hyper-checkbox>Accept terms</hyper-checkbox>',
  imports: [HyperCheckbox],
})
class BasicHost {}

@Component({
  template: '<hyper-checkbox [checked]="checked" [disabled]="disabled" color="secondary">Opt in</hyper-checkbox>',
  imports: [HyperCheckbox],
})
class ConfigurableHost {
  checked = false;
  disabled = false;
}

@Component({
  template: '<hyper-checkbox [indeterminate]="indeterminate">All</hyper-checkbox>',
  imports: [HyperCheckbox],
})
class IndeterminateHost {
  indeterminate = true;
}

// ── Specs ──

describe('HyperCheckbox', () => {
  describe('basic', () => {
    let fixture: ComponentFixture<BasicHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [BasicHost],
      }).compileComponents();
      fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
    });

    it('should create', () => {
      const el = fixture.nativeElement.querySelector('hyper-checkbox');
      expect(el).toBeTruthy();
    });

    it('should have base class', () => {
      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-checkbox');
      expect(el.classList.contains('hyper-checkbox-base')).toBe(true);
    });

    it('should default to primary color', () => {
      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-checkbox');
      expect(el.classList.contains('hyper-primary')).toBe(true);
    });

    it('should render label content', () => {
      const label = fixture.nativeElement.querySelector('.hyper-checkbox-label');
      expect(label.textContent?.trim()).toBe('Accept terms');
    });

    it('should default to unchecked', () => {
      const frame: HTMLElement = fixture.nativeElement.querySelector('.hyper-checkbox-frame');
      expect(frame.getAttribute('aria-checked')).toBe('false');
    });

    it('should toggle on click', () => {
      const label: HTMLElement = fixture.nativeElement.querySelector('.hyper-checkbox-layout');
      label.click();
      fixture.detectChanges();

      const frame: HTMLElement = fixture.nativeElement.querySelector('.hyper-checkbox-frame');
      expect(frame.getAttribute('aria-checked')).toBe('true');
    });
  });

  describe('configurable', () => {
    let fixture: ComponentFixture<ConfigurableHost>;
    let host: ConfigurableHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ConfigurableHost],
      }).compileComponents();
      fixture = TestBed.createComponent(ConfigurableHost);
      host = fixture.componentInstance;
    });

    it('should apply secondary color class', () => {
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-checkbox');
      expect(el.classList.contains('hyper-secondary')).toBe(true);
    });

    it('should reflect checked input', () => {
      host.checked = true;
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-checkbox');
      expect(el.classList.contains('hyper-checkbox-checked')).toBe(true);
    });

    it('should reflect disabled state', () => {
      host.disabled = true;
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-checkbox');
      expect(el.classList.contains('hyper-checkbox-disabled')).toBe(true);
    });
  });

  describe('indeterminate', () => {
    let fixture: ComponentFixture<IndeterminateHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [IndeterminateHost],
      }).compileComponents();
      fixture = TestBed.createComponent(IndeterminateHost);
      fixture.detectChanges();
    });

    it('should show indeterminate state', () => {
      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-checkbox');
      expect(el.classList.contains('hyper-checkbox-indeterminate')).toBe(true);
    });

    it('should have aria-checked mixed', () => {
      const frame: HTMLElement = fixture.nativeElement.querySelector('.hyper-checkbox-frame');
      expect(frame.getAttribute('aria-checked')).toBe('mixed');
    });
  });
});
