import { Component } from '@angular/core';
import { HyperFormField, HyperPrefix, HyperSuffix } from 'hypervault/form-field';
import { HyperIcon } from 'hypervault/icon';
@Component({
  selector: 'app-form-field-page',
  imports: [HyperFormField, HyperIcon, HyperPrefix, HyperSuffix],
  templateUrl: './form-field-page.html',
})
export class FormFieldPage {
  showPassword = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
