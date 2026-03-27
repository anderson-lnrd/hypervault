import { Component, signal } from '@angular/core';
import {
  HyperAlert,
  HyperAlertIcon,
  HyperAlertTitle,
  HyperAlertActions,
} from 'hypervault/alert';
import { HyperButton } from 'hypervault/button';
@Component({
  selector: 'app-alert-page',
  imports: [HyperAlert, HyperAlertIcon, HyperAlertTitle, HyperAlertActions, HyperButton],
  templateUrl: './alert-page.html',
})
export class AlertPage {
  showDismissible = signal(true);

  resetDismissible(): void {
    this.showDismissible.set(true);
  }
}
