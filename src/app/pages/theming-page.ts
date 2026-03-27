import { Component, inject } from '@angular/core';
import { HyperBadge } from 'hypervault/badge';
import { HyperButton } from 'hypervault/button';
import { HyperThemeService, HyperThemePicker } from 'hypervault/theming';
@Component({
  selector: 'app-theming-page',
  imports: [HyperThemePicker, HyperButton, HyperBadge],
  templateUrl: './theming-page.html',
})
export class ThemingPage {
  readonly themeService = inject(HyperThemeService);
}
