import { Component } from '@angular/core';

@Component({
  selector: 'hyper-icon',
  template: '<ng-content></ng-content>',
  styleUrl: './icon.scss',
  host: {
    'role': 'img',
    '[attr.aria-hidden]': 'true',
  },
})
export class HyperIcon {}
