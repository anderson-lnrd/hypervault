import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { HyperAlert, HyperAlertTitle } from './alert';

@Component({
  template: `
    <hyper-alert variant="success" [dismissible]="true" (dismissed)="onDismiss()">
      <span hyper-alert-title>Sucesso</span>
      Operacao concluida.
    </hyper-alert>
  `,
  imports: [HyperAlert, HyperAlertTitle],
})
class TestHost {
  dismissed = false;
  onDismiss() { this.dismissed = true; }
}

describe('HyperAlert', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  it('should create', () => {
    const el = fixture.nativeElement.querySelector('hyper-alert');
    expect(el).toBeTruthy();
    expect(el.getAttribute('role')).toBe('alert');
  });

  it('should apply variant class', () => {
    const el = fixture.nativeElement.querySelector('hyper-alert');
    expect(el.classList).toContain('hyper-alert-success');
  });

  it('should emit dismissed on close click', () => {
    const btn = fixture.nativeElement.querySelector('.hyper-alert-dismiss');
    btn.click();
    expect(fixture.componentInstance.dismissed).toBe(true);
  });
});
