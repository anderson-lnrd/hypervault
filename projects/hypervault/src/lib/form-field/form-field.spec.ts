import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { HyperFormField, HyperPrefix, HyperSuffix } from './form-field';

@Component({
  template: `
    <hyper-form-field label="Email">
      <input class="hyper-input" placeholder="seu@email.com" />
    </hyper-form-field>
  `,
  imports: [HyperFormField],
})
class BasicHost {}

@Component({
  template: `
    <hyper-form-field label="Buscar">
      <hyper-icon hyperPrefix>search</hyper-icon>
      <input class="hyper-input" placeholder="Buscar..." />
    </hyper-form-field>
  `,
  imports: [HyperFormField, HyperPrefix],
})
class PrefixHost {}

@Component({
  template: `
    <hyper-form-field label="Senha">
      <input class="hyper-input" type="password" />
      <button hyperSuffix>👁</button>
    </hyper-form-field>
  `,
  imports: [HyperFormField, HyperSuffix],
})
class SuffixHost {}

@Component({
  template: `
    <hyper-form-field>
      <input class="hyper-input" placeholder="No label" />
    </hyper-form-field>
  `,
  imports: [HyperFormField],
})
class NoLabelHost {}

describe('HyperFormField', () => {
  describe('basic', () => {
    let fixture: ComponentFixture<BasicHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
    });

    it('should create', () => {
      const el = fixture.nativeElement.querySelector('hyper-form-field');
      expect(el).toBeTruthy();
    });

    it('should render label', () => {
      const label = fixture.nativeElement.querySelector('.hyper-form-field-label');
      expect(label.textContent.trim()).toBe('Email');
    });

    it('should contain the input', () => {
      const input = fixture.nativeElement.querySelector('input.hyper-input');
      expect(input).toBeTruthy();
    });

    it('should have container element', () => {
      const container = fixture.nativeElement.querySelector('.hyper-form-field-container');
      expect(container).toBeTruthy();
    });
  });

  describe('no label', () => {
    let fixture: ComponentFixture<NoLabelHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [NoLabelHost] }).compileComponents();
      fixture = TestBed.createComponent(NoLabelHost);
      fixture.detectChanges();
    });

    it('should not render label element when label is not set', () => {
      const label = fixture.nativeElement.querySelector('.hyper-form-field-label');
      expect(label).toBeFalsy();
    });
  });

  describe('prefix', () => {
    let fixture: ComponentFixture<PrefixHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [PrefixHost] }).compileComponents();
      fixture = TestBed.createComponent(PrefixHost);
      fixture.detectChanges();
    });

    it('should project prefix content', () => {
      const prefix = fixture.nativeElement.querySelector('[hyperPrefix]');
      expect(prefix).toBeTruthy();
    });
  });

  describe('suffix', () => {
    let fixture: ComponentFixture<SuffixHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [SuffixHost] }).compileComponents();
      fixture = TestBed.createComponent(SuffixHost);
      fixture.detectChanges();
    });

    it('should project suffix content', () => {
      const suffix = fixture.nativeElement.querySelector('[hyperSuffix]');
      expect(suffix).toBeTruthy();
    });
  });
});
