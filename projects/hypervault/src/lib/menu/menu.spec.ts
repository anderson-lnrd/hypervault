import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, viewChild } from '@angular/core';
import { HyperMenu, HyperMenuItem, HyperMenuTrigger, HyperMenuDivider } from './menu';

@Component({
  imports: [HyperMenu, HyperMenuItem, HyperMenuTrigger, HyperMenuDivider],
  template: `
    <button [hyperMenuTriggerFor]="menu">Open</button>
    <hyper-menu #menu>
      <hyper-menu-item>Item 1</hyper-menu-item>
      <hyper-menu-divider />
      <hyper-menu-item>Item 2</hyper-menu-item>
    </hyper-menu>
  `,
})
class TestMenuHost {
  trigger = viewChild(HyperMenuTrigger);
}

describe('HyperMenu', () => {
  let fixture: ComponentFixture<TestMenuHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestMenuHost] }).compileComponents();
    fixture = TestBed.createComponent(TestMenuHost);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should start closed', () => {
    const trigger = fixture.componentInstance.trigger();
    expect(trigger?.isOpen()).toBe(false);
  });
});
