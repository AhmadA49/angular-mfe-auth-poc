import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

/**
 * Orders MFE Application Configuration
 * 
 * Note: MSAL is NOT configured here because it's shared from the Shell.
 * The MSAL instance is provided via Module Federation's shared dependencies.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
  ],
};
