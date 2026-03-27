import { Component, signal, ViewChild } from '@angular/core';
import { HyperButton } from 'hypervault/button';
import {
  HyperStepper,
  HyperStep,
  HyperStepperPrevious,
  HyperStepperNext,
} from 'hypervault/stepper';
@Component({
  selector: 'app-stepper-page',
  imports: [HyperStepper, HyperStep, HyperStepperPrevious, HyperStepperNext, HyperButton],
  templateUrl: './stepper-page.html',
})
export class StepperPage {
  @ViewChild('linearStepper') linearStepper!: HyperStepper;

  readonly hasError = signal(false);

  simulateError(): void {
    this.hasError.set(true);
  }

  clearError(): void {
    this.hasError.set(false);
  }
}
