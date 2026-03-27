import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { HyperSlider } from './slider';

@Component({
  template: '<hyper-slider>Volume</hyper-slider>',
  imports: [HyperSlider],
})
class BasicHost {}

@Component({
  template: '<hyper-slider [value]="value" [min]="min" [max]="max" [disabled]="disabled" color="secondary">Brilho</hyper-slider>',
  imports: [HyperSlider],
})
class ConfigurableHost {
  value = 50;
  min = 0;
  max = 100;
  disabled = false;
}

describe('HyperSlider', () => {
  describe('basic', () => {
    let fixture: ComponentFixture<BasicHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
    });

    it('should create', () => {
      const el = fixture.nativeElement.querySelector('hyper-slider');
      expect(el).toBeTruthy();
    });

    it('should have base class', () => {
      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-slider');
      expect(el.classList.contains('hyper-slider-base')).toBe(true);
    });

    it('should render label', () => {
      const label = fixture.nativeElement.querySelector('.hyper-slider-label');
      expect(label.textContent.trim()).toBe('Volume');
    });

    it('should show value display', () => {
      const value = fixture.nativeElement.querySelector('.hyper-slider-value');
      expect(value).toBeTruthy();
      expect(value.textContent.trim()).toBe('0%');
    });

    it('should contain a range input', () => {
      const input = fixture.nativeElement.querySelector('input[type="range"]');
      expect(input).toBeTruthy();
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

    it('should reflect value input', () => {
      host.value = 50;
      fixture.detectChanges();

      const value = fixture.nativeElement.querySelector('.hyper-slider-value');
      expect(value.textContent.trim()).toBe('50%');
    });

    it('should apply secondary color', () => {
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-slider');
      expect(el.classList.contains('hyper-secondary')).toBe(true);
    });

    it('should reflect disabled state', () => {
      host.disabled = true;
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-slider');
      expect(el.classList.contains('hyper-slider-disabled')).toBe(true);
    });

    it('should set range input attributes', () => {
      host.min = 10;
      host.max = 200;
      fixture.detectChanges();

      const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="range"]');
      expect(input.min).toBe('10');
      expect(input.max).toBe('200');
    });
  });
});
