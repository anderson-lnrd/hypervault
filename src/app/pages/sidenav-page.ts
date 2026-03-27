import { Component, viewChild } from '@angular/core';
import { HyperButton } from 'hypervault/button';
import { HyperIcon } from 'hypervault/icon';
import { HyperSidenav, HyperSidenavContainer, HyperSidenavContent } from 'hypervault/sidenav';
@Component({
  selector: 'app-sidenav-page',
  imports: [HyperButton, HyperIcon, HyperSidenavContainer, HyperSidenav, HyperSidenavContent],
  templateUrl: './sidenav-page.html',
})
export class SidenavPage {
  mode: 'over' | 'push' | 'side' = 'over';
  position: 'start' | 'end' = 'start';
  opened = false;

  readonly sidenav = viewChild(HyperSidenav);
}
