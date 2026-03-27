import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { HyperTabGroup, HyperTab } from './tabs';

@Component({
  selector: 'test-host',
  imports: [HyperTabGroup, HyperTab],
  template: `
    <hyper-tab-group>
      <hyper-tab label="Tab 1" />
      <hyper-tab label="Tab 2" />
      <hyper-tab label="Tab 3" [disabled]="true" />
    </hyper-tab-group>
  `,
})
class TestHost {}

describe('HyperTabGroup', () => {
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

  it('should render tab buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.hyper-tab-button');
    expect(buttons.length).toBe(3);
  });

  it('should disable tab', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.hyper-tab-button');
    expect(buttons[2].classList.contains('hyper-tab-disabled')).toBeTrue();
  });
});
