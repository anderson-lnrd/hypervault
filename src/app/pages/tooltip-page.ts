import { Component } from '@angular/core';
import { HyperButton } from 'hypervault/button';
import { HyperTooltip } from 'hypervault/tooltip';
@Component({
  selector: 'app-tooltip-page',
  imports: [HyperTooltip, HyperButton],
  templateUrl: './tooltip-page.html',
})
export class TooltipPage {}
