import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HyperStepper, HyperStep } from './stepper';

describe('HyperStepper', () => {
  let fixture: ComponentFixture<HyperStepper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HyperStepper, HyperStep],
    }).compileComponents();

    fixture = TestBed.createComponent(HyperStepper);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
