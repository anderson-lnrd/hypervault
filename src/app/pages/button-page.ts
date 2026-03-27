import { Component } from '@angular/core';
import { HyperButton } from 'hypervault/button';
import { HyperDensityDirective } from 'hypervault/density';
import { HyperIcon } from 'hypervault/icon';
@Component({
  selector: 'app-button-page',
  imports: [HyperButton, HyperIcon, HyperDensityDirective],
  templateUrl: './button-page.html',
})
export class ButtonPage {}
