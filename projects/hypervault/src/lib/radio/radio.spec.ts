import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { HyperRadioGroup, HyperRadioButton } from './radio';

@Component({
  selector: 'test-host',
  imports: [HyperRadioGroup, HyperRadioButton],
  template: `
    <hyper-radio-group [(value)]="selected">
      <hyper-radio-button [value]="'a'">Option A</hyper-radio-button>
      <hyper-radio-button [value]="'b'">Option B</hyper-radio-button>
      <hyper-radio-button [value]="'c'" [disabled]="true">Option C</hyper-radio-button>
    </hyper-radio-group>
  `,
})
class TestHost {
  selected = 'a';
}

describe('HyperRadioGroup', () => {
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

  it('should render radio buttons', () => {
    const radios = fixture.nativeElement.querySelectorAll('.hyper-radio-outer');
    expect(radios.length).toBe(3);
  });
});
