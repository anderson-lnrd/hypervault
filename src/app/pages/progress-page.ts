import { Component, signal } from '@angular/core';
import { HyperButton } from 'hypervault/button';
import { HyperProgressBar } from 'hypervault/progress-bar';
import { HyperSpinner } from 'hypervault/spinner';
@Component({
  selector: 'app-progress-page',
  imports: [HyperProgressBar, HyperSpinner, HyperButton],
  templateUrl: './progress-page.html',
})
export class ProgressPage {
  determinateValue = signal(45);
  bufferValue = signal(70);
  spinnerValue = signal(65);

  incrementProgress(): void {
    this.determinateValue.update(v => Math.min(100, v + 10));
  }

  resetProgress(): void {
    this.determinateValue.set(0);
  }
}
