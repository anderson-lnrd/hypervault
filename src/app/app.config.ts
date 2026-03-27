import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { HYPER_BREADCRUMB_HOME } from 'hypervault/breadcrumb';
import { provideHyperDefaults } from 'hypervault/core';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled' })),
    { provide: HYPER_BREADCRUMB_HOME, useValue: { label: 'Home', url: '/', icon: 'home' } },
    provideHyperDefaults({
      button: { color: 'primary', size: 'md' },
    }),
  ]
};
