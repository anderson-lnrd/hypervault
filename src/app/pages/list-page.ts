import { Component, signal } from '@angular/core';
import {
  HyperList,
  HyperListItem,
  HyperListItemIcon,
  HyperListItemMeta,
  HyperListItemLine,
  HyperListDivider,
  HyperListSubheader,
  HyperSelectionList,
  HyperListOption,
} from 'hypervault/list';
@Component({
  selector: 'app-list-page',
  imports: [
    HyperList,
    HyperListItem,
    HyperListItemIcon,
    HyperListItemMeta,
    HyperListItemLine,
    HyperListDivider,
    HyperListSubheader,
    HyperSelectionList,
    HyperListOption,
  ],
  templateUrl: './list-page.html',
})
export class ListPage {
  selectedItems = signal<unknown[]>([]);

  onSelectionChange(items: unknown[]) {
    this.selectedItems.set(items);
  }
}
