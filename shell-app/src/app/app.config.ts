import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

// MSAL imports
import {
  MsalModule,
  MsalService,
  MsalGuard,
  MsalBroadcastService,
  MsalInterceptor,
  MSAL_INSTANCE,
  MSAL_GUARD_CONFIG,
  MSAL_INTERCEPTOR_CONFIG,
} from '@azure/msal-angular';

// Auth configuration
import {
  MSALInstanceFactory,
  MSALGuardConfigFactory,
  MSALInterceptorConfigFactory,
} from './auth/auth-config';

import { routes } from './app.routes';

/**
 * Application configuration
 * 
 * This configures:
 * - Angular routing with blocking initial navigation
 * - HTTP client with DI-based interceptors
 * - MSAL for Azure AD authentication
 * - HTTP interceptor for automatic token attachment
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Core Angular providers
    importProvidersFrom(BrowserModule),
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),

    // MSAL Module
    importProvidersFrom(MsalModule),
    
    // MSAL HTTP Interceptor - automatically attaches JWT to protected API calls
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    
    // MSAL Instance - singleton shared across all MFEs via Module Federation
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    
    // MSAL Guard Configuration - controls login behavior
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
    },
    
    // MSAL Interceptor Configuration - defines protected resources
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
    },
    
    // MSAL Services
    MsalService,
    MsalGuard,
    MsalBroadcastService,
  ],
};
