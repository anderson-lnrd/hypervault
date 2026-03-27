import { Component, Directive, ViewEncapsulation, input } from '@angular/core';

@Directive({ selector: '[hyperPrefix]' })
export class HyperPrefix {}

@Directive({ selector: '[hyperSuffix]' })
export class HyperSuffix {}

@Component({
  selector: 'hyper-form-field',
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'hyper-form-field',
  },
})
export class HyperFormField {
  readonly label = input<string>();
}
