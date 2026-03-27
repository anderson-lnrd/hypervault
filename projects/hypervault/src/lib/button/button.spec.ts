import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { HyperButton, HyperButtonColor, HyperButtonSize, HyperHoverEffect } from './button';

// ── Test hosts ──

@Component({
  template: '<button hyper-button>Flat</button>',
  imports: [HyperButton],
})
class FlatButtonHost {}

@Component({
  template: '<button hyper-raised-button>Raised</button>',
  imports: [HyperButton],
})
class RaisedButtonHost {}

@Component({
  template: '<button hyper-stroked-button>Stroked</button>',
  imports: [HyperButton],
})
class StrokedButtonHost {}

@Component({
  template: '<button hyper-icon-button aria-label="test">X</button>',
  imports: [HyperButton],
})
class IconButtonHost {}

@Component({
  template: '<button hyper-ghost-button>Ghost</button>',
  imports: [HyperButton],
})
class GhostButtonHost {}

@Component({
  template: '<button hyper-link-button>Link</button>',
  imports: [HyperButton],
})
class LinkButtonHost {}

@Component({
  template:
    '<button hyper-raised-button [color]="color" [size]="size" [hoverEffect]="hoverEffect" [loading]="loading">Test</button>',
  imports: [HyperButton],
})
class ConfigurableHost {
  color?: HyperButtonColor;
  size: HyperButtonSize = 'md';
  hoverEffect: HyperHoverEffect = 'none';
  loading = false;
}

// ── Specs ──

describe('HyperButton', () => {
  describe('hyper-button (flat)', () => {
    let fixture: ComponentFixture<FlatButtonHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FlatButtonHost],
      }).compileComponents();

      fixture = TestBed.createComponent(FlatButtonHost);
      fixture.detectChanges();
    });

    it('should create', () => {
      const btn = fixture.nativeElement.querySelector('button');
      expect(btn).toBeTruthy();
    });

    it('should have hyper-button-base class', () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.classList.contains('hyper-button-base')).toBe(true);
    });

    it('should have no hover class by default', () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.classList.contains('hover-none')).toBe(false);
      expect(btn.classList.contains('hover-press-3d')).toBe(false);
    });

    it('should have default hyper-size-md class', () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.classList.contains('hyper-size-md')).toBe(true);
    });

    it('should render text content', () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.textContent?.trim()).toBe('Flat');
    });

    it('should not have color class when color is not set', () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.classList.contains('hyper-primary')).toBe(false);
      expect(btn.classList.contains('hyper-secondary')).toBe(false);
    });
  });

  describe('hyper-raised-button', () => {
    let fixture: ComponentFixture<RaisedButtonHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [RaisedButtonHost],
      }).compileComponents();

      fixture = TestBed.createComponent(RaisedButtonHost);
      fixture.detectChanges();
    });

    it('should have hyper-button-base class', () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.classList.contains('hyper-button-base')).toBe(true);
    });

    it('should have the hyper-raised-button attribute', () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.hasAttribute('hyper-raised-button')).toBe(true);
    });
  });

  describe('hyper-stroked-button', () => {
    let fixture: ComponentFixture<StrokedButtonHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [StrokedButtonHost],
      }).compileComponents();

      fixture = TestBed.createComponent(StrokedButtonHost);
      fixture.detectChanges();
    });

    it('should have hyper-button-base class', () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.classList.contains('hyper-button-base')).toBe(true);
    });

    it('should have the hyper-stroked-button attribute', () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.hasAttribute('hyper-stroked-button')).toBe(true);
    });
  });

  describe('hyper-icon-button', () => {
    let fixture: ComponentFixture<IconButtonHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [IconButtonHost],
      }).compileComponents();

      fixture = TestBed.createComponent(IconButtonHost);
      fixture.detectChanges();
    });

    it('should have hyper-button-base class', () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.classList.contains('hyper-button-base')).toBe(true);
    });

    it('should have native aria-label', () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.getAttribute('aria-label')).toBe('test');
    });

    it('should have the hyper-icon-button attribute', () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.hasAttribute('hyper-icon-button')).toBe(true);
    });
  });

  describe('hyper-ghost-button', () => {
    let fixture: ComponentFixture<GhostButtonHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [GhostButtonHost],
      }).compileComponents();

      fixture = TestBed.createComponent(GhostButtonHost);
      fixture.detectChanges();
    });

    it('should have hyper-button-base class', () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.classList.contains('hyper-button-base')).toBe(true);
    });

    it('should have the hyper-ghost-button attribute', () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.hasAttribute('hyper-ghost-button')).toBe(true);
    });
  });

  describe('hyper-link-button', () => {
    let fixture: ComponentFixture<LinkButtonHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LinkButtonHost],
      }).compileComponents();

      fixture = TestBed.createComponent(LinkButtonHost);
      fixture.detectChanges();
    });

    it('should have hyper-button-base class', () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.classList.contains('hyper-button-base')).toBe(true);
    });

    it('should have the hyper-link-button attribute', () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.hasAttribute('hyper-link-button')).toBe(true);
    });
  });

  describe('configurable inputs', () => {
    let fixture: ComponentFixture<ConfigurableHost>;
    let host: ConfigurableHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ConfigurableHost],
      }).compileComponents();

      fixture = TestBed.createComponent(ConfigurableHost);
      host = fixture.componentInstance;
    });

    it('should add hyper-secondary class when color is secondary', () => {
      host.color = 'secondary';
      fixture.detectChanges();

      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.classList.contains('hyper-secondary')).toBe(true);
    });

    it('should add hyper-primary class when color is primary', () => {
      host.color = 'primary';
      fixture.detectChanges();

      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.classList.contains('hyper-primary')).toBe(true);
    });

    it('should not add color class when color is not set', () => {
      fixture.detectChanges();

      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.classList.contains('hyper-primary')).toBe(false);
      expect(btn.classList.contains('hyper-secondary')).toBe(false);
    });

    it('should add hover effect class', () => {
      host.hoverEffect = 'press-3d';
      fixture.detectChanges();

      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.classList.contains('hover-press-3d')).toBe(true);
    });

    it('should apply size class', () => {
      host.size = 'sm';
      fixture.detectChanges();

      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.classList.contains('hyper-size-sm')).toBe(true);
    });

    it('should apply large size class', () => {
      host.size = 'lg';
      fixture.detectChanges();

      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.classList.contains('hyper-size-lg')).toBe(true);
    });

    it('should add hyper-loading class and disabled attr when loading', () => {
      host.loading = true;
      fixture.detectChanges();

      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.classList.contains('hyper-loading')).toBe(true);
      expect(btn.disabled).toBe(true);
    });

    it('should render spinner when loading', () => {
      host.loading = true;
      fixture.detectChanges();

      const spinner = fixture.nativeElement.querySelector('.hyper-spinner');
      expect(spinner).toBeTruthy();
    });

    it('should not render spinner when not loading', () => {
      fixture.detectChanges();

      const spinner = fixture.nativeElement.querySelector('.hyper-spinner');
      expect(spinner).toBeFalsy();
    });

    it('should support native disabled attribute', () => {
      fixture.detectChanges();
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.disabled).toBe(false);
    });

    it('should switch hover class when hoverEffect changes', () => {
      host.hoverEffect = 'hover-primary';
      fixture.detectChanges();

      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.classList.contains('hover-hover-primary')).toBe(true);
      expect(btn.classList.contains('hover-none')).toBe(false);
    });
  });
});
