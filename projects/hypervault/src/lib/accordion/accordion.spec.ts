import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { HyperAccordion, HyperExpansionPanel } from './accordion';

@Component({
  selector: 'test-host',
  imports: [HyperAccordion, HyperExpansionPanel],
  template: `
    <hyper-accordion>
      <hyper-expansion-panel title="Panel 1">Content 1</hyper-expansion-panel>
      <hyper-expansion-panel title="Panel 2">Content 2</hyper-expansion-panel>
      <hyper-expansion-panel title="Panel 3" [disabled]="true">Content 3</hyper-expansion-panel>
    </hyper-accordion>
  `,
})
class TestHost {}

describe('HyperAccordion', () => {
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

  it('should render panel headers', () => {
    const headers = fixture.nativeElement.querySelectorAll('.hyper-panel-header');
    expect(headers.length).toBe(3);
  });

  it('should toggle panel on click', () => {
    const header = fixture.nativeElement.querySelector('.hyper-panel-header');
    header.click();
    fixture.detectChanges();
    const body = fixture.nativeElement.querySelector('.hyper-panel-body');
    expect(body).toBeTruthy();
    expect(body.textContent).toContain('Content 1');
  });

  it('should not toggle disabled panel', () => {
    const headers = fixture.nativeElement.querySelectorAll('.hyper-panel-header');
    headers[2].click();
    fixture.detectChanges();
    const bodies = fixture.nativeElement.querySelectorAll('.hyper-panel-body');
    expect(bodies.length).toBe(0);
  });
});
