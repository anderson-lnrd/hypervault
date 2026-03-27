import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import {
  HyperToolbar,
  HyperToolbarStart,
  HyperToolbarCenter,
  HyperToolbarEnd,
  HyperToolbarSeparator,
  HyperToolbarTitle,
  HyperToolbarRow,
} from './toolbar';

@Component({
  template: `
    <hyper-toolbar>
      <hyper-toolbar-start>
        <span hyper-toolbar-title>Title</span>
      </hyper-toolbar-start>
      <hyper-toolbar-end>
        <button>Action</button>
      </hyper-toolbar-end>
    </hyper-toolbar>
  `,
  imports: [HyperToolbar, HyperToolbarStart, HyperToolbarEnd, HyperToolbarTitle],
})
class TestHost {}

describe('HyperToolbar', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  it('should create', () => {
    const toolbar = fixture.nativeElement.querySelector('hyper-toolbar');
    expect(toolbar).toBeTruthy();
    expect(toolbar.classList).toContain('hyper-toolbar');
  });

  it('should have role toolbar', () => {
    const toolbar = fixture.nativeElement.querySelector('hyper-toolbar');
    expect(toolbar.getAttribute('role')).toBe('toolbar');
  });

  it('should apply color class', () => {
    const toolbar = fixture.nativeElement.querySelector('hyper-toolbar');
    expect(toolbar.classList).toContain('hyper-toolbar-default');
  });

  it('should apply bordered class by default', () => {
    const toolbar = fixture.nativeElement.querySelector('hyper-toolbar');
    expect(toolbar.classList).toContain('hyper-toolbar-bordered');
  });

  it('should render projected content', () => {
    expect(fixture.nativeElement.textContent).toContain('Title');
    expect(fixture.nativeElement.textContent).toContain('Action');
  });
});
