import { Component, signal } from '@angular/core';
import { HyperRadioGroup, HyperRadioButton } from 'hypervault/radio';
@Component({
  selector: 'app-radio-page',
  imports: [HyperRadioGroup, HyperRadioButton],
  templateUrl: './radio-page.html',
})
export class RadioPage {
  selectedFruit = signal('apple');
  selectedColor = signal('primary');
}
