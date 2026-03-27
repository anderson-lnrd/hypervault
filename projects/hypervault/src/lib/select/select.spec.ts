import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { HyperSelect, HyperOption } from './select';

@Component({
  selector: 'test-host',
  imports: [HyperSelect, HyperOption],
  template: `
    <hyper-select placeholder="Choose one">
      <hyper-option [value]="'a'">Alpha</hyper-option>
      <hyper-option [value]="'b'">Beta</hyper-option>
      <hyper-option [value]="'c'" [disabled]="true">Gamma</hyper-option>
    </hyper-select>
  `,
})
class TestHost {}

describe('HyperSelect', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show placeholder', () => {
    const trigger = fixture.nativeElement.querySelector('.hyper-select-value');
    expect(trigger.textContent.trim()).toBe('Choose one');
  });
});
