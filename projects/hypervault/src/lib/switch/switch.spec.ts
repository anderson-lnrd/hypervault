import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { HyperSwitch } from './switch';

@Component({
  template: '<hyper-switch>Notificacoes</hyper-switch>',
  imports: [HyperSwitch],
})
class BasicHost {}

@Component({
  template: '<hyper-switch [checked]="checked" [disabled]="disabled" color="secondary">Opt in</hyper-switch>',
  imports: [HyperSwitch],
})
class ConfigurableHost {
  checked = false;
  disabled = false;
}

describe('HyperSwitch', () => {
  describe('basic', () => {
    let fixture: ComponentFixture<BasicHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
    });

    it('should create', () => {
      const el = fixture.nativeElement.querySelector('hyper-switch');
      expect(el).toBeTruthy();
    });

    it('should have base class', () => {
      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-switch');
      expect(el.classList.contains('hyper-switch-base')).toBe(true);
    });

    it('should default to unchecked', () => {
      const track: HTMLElement = fixture.nativeElement.querySelector('.hyper-switch-track');
      expect(track.getAttribute('aria-checked')).toBe('false');
    });

    it('should render label', () => {
      const label = fixture.nativeElement.querySelector('.hyper-switch-label');
      expect(label.textContent.trim()).toBe('Notificacoes');
    });

    it('should toggle on click', () => {
      const layout: HTMLElement = fixture.nativeElement.querySelector('.hyper-switch-layout');
      layout.click();
      fixture.detectChanges();

      const track: HTMLElement = fixture.nativeElement.querySelector('.hyper-switch-track');
      expect(track.getAttribute('aria-checked')).toBe('true');
    });

    it('should toggle back to off on second click', () => {
      const layout: HTMLElement = fixture.nativeElement.querySelector('.hyper-switch-layout');
      layout.click();
      fixture.detectChanges();
      layout.click();
      fixture.detectChanges();

      const track: HTMLElement = fixture.nativeElement.querySelector('.hyper-switch-track');
      expect(track.getAttribute('aria-checked')).toBe('false');
    });
  });

  describe('configurable', () => {
    let fixture: ComponentFixture<ConfigurableHost>;
    let host: ConfigurableHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [ConfigurableHost] }).compileComponents();
      fixture = TestBed.createComponent(ConfigurableHost);
      host = fixture.componentInstance;
    });

    it('should reflect checked input', () => {
      host.checked = true;
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-switch');
      expect(el.classList.contains('hyper-switch-checked')).toBe(true);
    });

    it('should apply secondary color', () => {
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-switch');
      expect(el.classList.contains('hyper-secondary')).toBe(true);
    });

    it('should reflect disabled state', () => {
      host.disabled = true;
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-switch');
      expect(el.classList.contains('hyper-switch-disabled')).toBe(true);
    });

    it('should not toggle when disabled', () => {
      host.disabled = true;
      fixture.detectChanges();

      const layout: HTMLElement = fixture.nativeElement.querySelector('.hyper-switch-layout');
      layout.click();
      fixture.detectChanges();

      const track: HTMLElement = fixture.nativeElement.querySelector('.hyper-switch-track');
      expect(track.getAttribute('aria-checked')).toBe('false');
    });
  });
});
