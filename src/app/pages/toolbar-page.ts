import { Component } from '@angular/core';
import { HyperBadge } from 'hypervault/badge';
import { HyperButton } from 'hypervault/button';
import { HyperDensityDirective } from 'hypervault/density';
import { HyperIcon } from 'hypervault/icon';
import {
  HyperToolbar,
  HyperToolbarStart,
  HyperToolbarCenter,
  HyperToolbarEnd,
  HyperToolbarSeparator,
  HyperToolbarTitle,
  HyperToolbarRow,
} from 'hypervault/toolbar';
@Component({
  selector: 'app-toolbar-page',
  imports: [
    HyperButton,
    HyperIcon,
    HyperToolbar,
    HyperToolbarStart,
    HyperToolbarCenter,
    HyperToolbarEnd,
    HyperToolbarSeparator,
    HyperToolbarTitle,
    HyperToolbarRow,
    HyperBadge,
    HyperDensityDirective,
  ],
  templateUrl: './toolbar-page.html',
})
export class ToolbarPage {}
