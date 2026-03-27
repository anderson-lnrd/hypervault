import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideRouter, Router, Routes } from '@angular/router';

import {
  HyperBreadcrumb,
  HyperBreadcrumbItem,
  HyperBreadcrumbService,
  HYPER_BREADCRUMB_HOME,
} from './breadcrumb';

// ── Dummy route components ──

@Component({ template: '' })
class DummyComponent {}

// ── Test host: manual items ──

@Component({
  template: `<hyper-breadcrumb [items]="items" />`,
  imports: [HyperBreadcrumb],
})
class ManualHost {
  items: HyperBreadcrumbItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Categorias', url: '/categorias' },
    { label: 'Teclados', url: '/categorias/teclados' },
  ];
}

// ── Test host: auto mode ──

@Component({
  template: `<hyper-breadcrumb />`,
  imports: [HyperBreadcrumb],
})
class AutoHost {}

const testRoutes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Home' },
    children: [
      {
        path: 'products',
        data: { breadcrumb: 'Produtos' },
        component: DummyComponent,
      },
    ],
  },
];

describe('HyperBreadcrumb', () => {
  describe('manual mode', () => {
    let fixture: ComponentFixture<ManualHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ManualHost],
        providers: [provideRouter([])],
      }).compileComponents();
      fixture = TestBed.createComponent(ManualHost);
      fixture.detectChanges();
    });

    it('should create', () => {
      const el = fixture.nativeElement.querySelector('hyper-breadcrumb');
      expect(el).toBeTruthy();
    });

    it('should have navigation role', () => {
      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-breadcrumb');
      expect(el.getAttribute('role')).toBe('navigation');
    });

    it('should have aria-label', () => {
      const el: HTMLElement = fixture.nativeElement.querySelector('hyper-breadcrumb');
      expect(el.getAttribute('aria-label')).toBe('Breadcrumb');
    });

    it('should render all items', () => {
      const items = fixture.nativeElement.querySelectorAll('li');
      expect(items.length).toBe(3);
    });

    it('should render links for non-last items', () => {
      const links = fixture.nativeElement.querySelectorAll('a');
      expect(links.length).toBe(2);
      expect(links[0].textContent.trim()).toBe('Home');
      expect(links[1].textContent.trim()).toBe('Categorias');
    });

    it('should render current page as span with aria-current', () => {
      const current = fixture.nativeElement.querySelector('[aria-current="page"]');
      expect(current).toBeTruthy();
      expect(current.textContent.trim()).toBe('Teclados');
    });

    it('should render separators between items', () => {
      const seps = fixture.nativeElement.querySelectorAll('.hyper-breadcrumb-sep');
      expect(seps.length).toBe(2);
    });

    it('should use default separator character', () => {
      const sep = fixture.nativeElement.querySelector('.hyper-breadcrumb-sep');
      expect(sep.textContent.trim()).toBe('›');
    });
  });

  describe('auto mode with router', () => {
    let fixture: ComponentFixture<AutoHost>;
    let router: Router;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AutoHost],
        providers: [provideRouter(testRoutes)],
      }).compileComponents();
      fixture = TestBed.createComponent(AutoHost);
      router = TestBed.inject(Router);
    });

    it('should auto-detect breadcrumbs from route data', async () => {
      await router.navigateByUrl('/products');
      fixture.detectChanges();
      const items = fixture.nativeElement.querySelectorAll('li');
      expect(items.length).toBe(2);
    });

    it('should resolve labels from route data', async () => {
      await router.navigateByUrl('/products');
      fixture.detectChanges();
      const links = fixture.nativeElement.querySelectorAll('a');
      expect(links[0].textContent.trim()).toBe('Home');
      const current = fixture.nativeElement.querySelector('[aria-current="page"]');
      expect(current.textContent.trim()).toBe('Produtos');
    });
  });

  describe('with home config', () => {
    let fixture: ComponentFixture<AutoHost>;
    let router: Router;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AutoHost],
        providers: [
          provideRouter(testRoutes),
          { provide: HYPER_BREADCRUMB_HOME, useValue: { label: 'Inicio', url: '/', icon: 'home' } },
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(AutoHost);
      router = TestBed.inject(Router);
    });

    it('should prepend home item from injection token', async () => {
      await router.navigateByUrl('/products');
      fixture.detectChanges();
      const links = fixture.nativeElement.querySelectorAll('a');
      expect(links[0].textContent.trim()).toContain('Inicio');
    });

    it('should render home icon', async () => {
      await router.navigateByUrl('/products');
      fixture.detectChanges();
      const icon = fixture.nativeElement.querySelector('.hyper-breadcrumb-icon');
      expect(icon).toBeTruthy();
      expect(icon.textContent.trim()).toBe('home');
    });
  });

  describe('service', () => {
    it('should be injectable', () => {
      TestBed.configureTestingModule({
        providers: [provideRouter([])],
      });
      const service = TestBed.inject(HyperBreadcrumbService);
      expect(service).toBeTruthy();
    });

    it('should expose items signal', () => {
      TestBed.configureTestingModule({
        providers: [provideRouter([])],
      });
      const service = TestBed.inject(HyperBreadcrumbService);
      expect(service.items()).toBeDefined();
      expect(Array.isArray(service.items())).toBe(true);
    });
  });
});
