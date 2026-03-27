import { Component, signal } from '@angular/core';
import { HyperChip, HyperChipSet, HyperChipInput } from 'hypervault/chip';
@Component({
  selector: 'app-chip-page',
  imports: [HyperChip, HyperChipSet, HyperChipInput],
  templateUrl: './chip-page.html',
})
export class ChipPage {
  removableItems = signal(['Design', 'Frontend', 'Backend', 'DevOps']);

  removeItem(item: string) {
    this.removableItems.update(items => items.filter(i => i !== item));
  }
}
