import { Component, signal } from '@angular/core';
import { HyperButton } from 'hypervault/button';
import {
  HyperMenu,
  HyperMenuItem,
  HyperMenuDivider,
  HyperMenuGroup,
  HyperMenuTrigger,
} from 'hypervault/menu';
@Component({
  selector: 'app-menu-page',
  imports: [HyperMenu, HyperMenuItem, HyperMenuDivider, HyperMenuGroup, HyperMenuTrigger, HyperButton],
  templateUrl: './menu-page.html',
})
export class MenuPage {
  lastAction = signal('');

  onAction(action: string): void {
    this.lastAction.set(action);
  }
}
