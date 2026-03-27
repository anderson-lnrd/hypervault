import { Component } from '@angular/core';
import { HyperSwitch } from 'hypervault/switch';
@Component({
  selector: 'app-switch-page',
  imports: [HyperSwitch],
  templateUrl: './switch-page.html',
})
export class SwitchPage {
  notifications = true;
  darkMode = false;
}
