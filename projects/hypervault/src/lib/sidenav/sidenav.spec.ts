import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, viewChild } from '@angular/core';

import { HyperSidenav, HyperSidenavContainer, HyperSidenavContent } from './sidenav';

@Component({
  template: `
    <hyper-sidenav-container>
      <hyper-sidenav>Nav</hyper-sidenav>
      <hyper-sidenav-content>Content</hyper-sidenav-content>
    </hyper-sidenav-container>
  `,
  imports: [HyperSidenavContainer, HyperSidenav, HyperSidenavContent],
})
class BasicHost {
  readonly sidenav = viewChild(HyperSidenav);
}

@Component({
  template: `
    <hyper-sidenav-container>
      <hyper-sidenav [opened]="opened" [mode]="mode" [position]="position">Nav</hyper-sidenav>
      <hyper-sidenav-content>Content</hyper-sidenav-content>
    </hyper-sidenav-container>
  `,
  imports: [HyperSidenavContainer, HyperSidenav, HyperSidenavContent],
})
class ConfigurableHost {
  opened = false;
  mode: 'over' | 'push' | 'side' = 'over';
  position: 'start' | 'end' = 'start';
  readonly sidenav = viewChild(HyperSidenav);
}

describe('HyperSidenav', () => {
  describe('basic', () => {
    let fixture: ComponentFixture<BasicHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
    });

    it('should create container', () => {
      const el = fixture.nativeElement.querySelector('hyper-sidenav-container');
      expect(el).toBeTruthy();
    });

    it('should create sidenav', () => {
      const el = fixture.nativeElement.querySelector('hyper-sidenav');
      expect(el).toBeTruthy();
    });

    it('should have navigation role', () => {
      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-sidenav');
      expect(el.getAttribute('role')).toBe('navigation');
    });

    it('should default to closed', () => {
      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-sidenav');
      expect(el.classList.contains('hyper-sidenav-opened')).toBe(false);
    });

    it('should toggle open/close', () => {
      const sidenav = fixture.componentInstance.sidenav()!;
      sidenav.toggle();
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-sidenav');
      expect(el.classList.contains('hyper-sidenav-opened')).toBe(true);

      sidenav.toggle();
      fixture.detectChanges();
      expect(el.classList.contains('hyper-sidenav-opened')).toBe(false);
    });

    it('should open and close programmatically', () => {
      const sidenav = fixture.componentInstance.sidenav()!;
      sidenav.open();
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-sidenav');
      expect(el.classList.contains('hyper-sidenav-opened')).toBe(true);

      sidenav.close();
      fixture.detectChanges();
      expect(el.classList.contains('hyper-sidenav-opened')).toBe(false);
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

    it('should apply side mode class', () => {
      host.mode = 'side';
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-sidenav');
      expect(el.classList.contains('hyper-sidenav-side')).toBe(true);
    });

    it('should apply push mode class', () => {
      host.mode = 'push';
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-sidenav');
      expect(el.classList.contains('hyper-sidenav-push')).toBe(true);
    });

    it('should apply end position class', () => {
      host.position = 'end';
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-sidenav');
      expect(el.classList.contains('hyper-sidenav-end')).toBe(true);
    });

    it('should close on backdrop click in over mode', () => {
      host.opened = true;
      host.mode = 'over';
      fixture.detectChanges();
      const backdrop: HTMLElement = fixture.nativeElement.querySelector('.hyper-sidenav-backdrop');
      backdrop.click();
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-sidenav');
      expect(el.classList.contains('hyper-sidenav-opened')).toBe(false);
    });

    it('should not close on backdrop click in side mode', () => {
      host.opened = true;
      host.mode = 'side';
      fixture.detectChanges();
      const backdrop: HTMLElement = fixture.nativeElement.querySelector('.hyper-sidenav-backdrop');
      backdrop.click();
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-sidenav');
      expect(el.classList.contains('hyper-sidenav-opened')).toBe(true);
    });
  });
});
