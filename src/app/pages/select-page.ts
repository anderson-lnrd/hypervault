import { Component } from '@angular/core';
import { HyperSelect, HyperOption, HyperOptGroup } from 'hypervault/select';
@Component({
  selector: 'app-select-page',
  imports: [HyperSelect, HyperOption, HyperOptGroup],
  templateUrl: './select-page.html',
})
export class SelectPage {
  selectedFruit = '';
  selectedColors: string[] = [];

  onFruitChange(val: unknown) {
    this.selectedFruit = val as string;
  }

  onColorsChange(val: unknown) {
    this.selectedColors = val as string[];
  }
}
