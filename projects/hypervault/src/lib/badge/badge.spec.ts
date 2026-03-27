import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { HyperBadge } from './badge';

@Component({
  template: '<hyper-badge>Default</hyper-badge>',
  imports: [HyperBadge],
})
class BasicHost {}

@Component({
  template: '<hyper-badge [variant]="variant" [rarity]="rarity">Test</hyper-badge>',
  imports: [HyperBadge],
})
class ConfigurableHost {
  variant: 'default' | 'secondary' | 'outline' | 'destructive' = 'default';
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | undefined;
}

describe('HyperBadge', () => {
  describe('basic', () => {
    let fixture: ComponentFixture<BasicHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
    });

    it('should create', () => {
      const el = fixture.nativeElement.querySelector('hyper-badge');
      expect(el).toBeTruthy();
    });

    it('should have base class', () => {
      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-badge');
      expect(el.classList.contains('hyper-badge-base')).toBe(true);
    });

    it('should default to default variant', () => {
      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-badge');
      expect(el.classList.contains('hyper-badge-default')).toBe(true);
    });

    it('should project content', () => {
      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-badge');
      expect(el.textContent!.trim()).toBe('Default');
    });
  });

  describe('variants', () => {
    let fixture: ComponentFixture<ConfigurableHost>;
    let host: ConfigurableHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [ConfigurableHost] }).compileComponents();
      fixture = TestBed.createComponent(ConfigurableHost);
      host = fixture.componentInstance;
    });

    it('should apply secondary variant', () => {
      host.variant = 'secondary';
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-badge');
      expect(el.classList.contains('hyper-badge-secondary')).toBe(true);
    });

    it('should apply outline variant', () => {
      host.variant = 'outline';
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-badge');
      expect(el.classList.contains('hyper-badge-outline')).toBe(true);
    });

    it('should apply destructive variant', () => {
      host.variant = 'destructive';
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-badge');
      expect(el.classList.contains('hyper-badge-destructive')).toBe(true);
    });
  });

  describe('rarity', () => {
    let fixture: ComponentFixture<ConfigurableHost>;
    let host: ConfigurableHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [ConfigurableHost] }).compileComponents();
      fixture = TestBed.createComponent(ConfigurableHost);
      host = fixture.componentInstance;
    });

    it('should apply common rarity', () => {
      host.rarity = 'common';
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-badge');
      expect(el.classList.contains('hyper-rarity-common')).toBe(true);
    });

    it('should apply rare rarity', () => {
      host.rarity = 'rare';
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-badge');
      expect(el.classList.contains('hyper-rarity-rare')).toBe(true);
    });

    it('should apply epic rarity', () => {
      host.rarity = 'epic';
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-badge');
      expect(el.classList.contains('hyper-rarity-epic')).toBe(true);
    });

    it('should apply legendary rarity', () => {
      host.rarity = 'legendary';
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-badge');
      expect(el.classList.contains('hyper-rarity-legendary')).toBe(true);
    });

    it('should prefer rarity over variant', () => {
      host.variant = 'secondary';
      host.rarity = 'epic';
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-badge');
      expect(el.classList.contains('hyper-rarity-epic')).toBe(true);
      expect(el.classList.contains('hyper-badge-secondary')).toBe(false);
    });
  });
});
