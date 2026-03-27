import {
  Component,
  ContentChild,
  Directive,
  ViewEncapsulation,
  input,
  model,
} from '@angular/core';

export type HyperSidenavMode = 'over' | 'push' | 'side';
export type HyperSidenavPosition = 'start' | 'end';

@Directive({
  selector: 'hyper-sidenav-content',
  host: {
    'class': 'hyper-sidenav-content',
  },
})
export class HyperSidenavContent {}

@Component({
  selector: 'hyper-sidenav',
  template: '<ng-content></ng-content>',
  styleUrl: './sidenav.scss',
  host: {
    'class': 'hyper-sidenav',
    'role': 'navigation',
    '[class.hyper-sidenav-opened]': 'opened()',
    '[class.hyper-sidenav-end]': 'position() === "end"',
    '[class.hyper-sidenav-over]': 'mode() === "over"',
    '[class.hyper-sidenav-push]': 'mode() === "push"',
    '[class.hyper-sidenav-side]': 'mode() === "side"',
  },
})
export class HyperSidenav {
  readonly opened = model(false);
  readonly mode = input<HyperSidenavMode>('over');
  readonly position = input<HyperSidenavPosition>('start');

  toggle(): void {
    this.opened.set(!this.opened());
  }

  open(): void {
    this.opened.set(true);
  }

  close(): void {
    this.opened.set(false);
  }
}

@Component({
  selector: 'hyper-sidenav-container',
  templateUrl: './sidenav-container.html',
  styleUrl: './sidenav-container.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [],
  host: {
    'class': 'hyper-sidenav-container',
    '[class.hyper-sidenav-container-has-open]': 'sidenav?.opened()',
  },
})
export class HyperSidenavContainer {
  @ContentChild(HyperSidenav) sidenav?: HyperSidenav;

  onBackdropClick(): void {
    if (this.sidenav && this.sidenav.mode() !== 'side') {
      this.sidenav.close();
    }
  }
}
