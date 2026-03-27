import { Component } from '@angular/core';
import {
  HyperTabGroup,
  HyperTab,
  HyperTabLabel,
  HyperTabLazyContent,
} from 'hypervault/tabs';
@Component({
  selector: 'app-tabs-page',
  imports: [HyperTabGroup, HyperTab, HyperTabLabel, HyperTabLazyContent],
  templateUrl: './tabs-page.html',
})
export class TabsPage {}
