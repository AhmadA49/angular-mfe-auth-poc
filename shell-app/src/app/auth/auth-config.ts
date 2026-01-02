import { 
  LogLevel, 
  Configuration, 
  BrowserCacheLocation,
  IPublicClientApplication,
  PublicClientApplication,
  InteractionType
} from '@azure/msal-browser';
import {
  MsalGuardConfiguration,
  MsalInterceptorConfiguration
} from '@azure/msal-angular';

// =====================================================
// REPLACE THESE VALUES WITH YOUR AZURE ENTRA ID CONFIG
// =====================================================
const TENANT_ID = '';
const CLIENT_ID = '';
const REDIRECT_URI = 'https://localhost:4200/';

/**
 * MSAL Configuration
 * - Uses Authorization Code Flow with PKCE (default in MSAL v3)
 * - LocalStorage for SSO across browser tabs
 */
export const msalConfig: Configuration = {
  auth: {
    clientId: CLIENT_ID,
    authority: `https://login.microsoftonline.com/${TENANT_ID}`,
    redirectUri: REDIRECT_URI,
    postLogoutRedirectUri: REDIRECT_URI,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    // LocalStorage enables SSO across tabs - CRITICAL for MFE architecture
    cacheLocation: BrowserCacheLocation.LocalStorage,
    storeAuthStateInCookie: false, // Set true for IE11 support
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error:
            console.error('[MSAL]', message);
            break;
          case LogLevel.Warning:
            console.warn('[MSAL]', message);
            break;
          case LogLevel.Info:
            console.info('[MSAL]', message);
            break;
          case LogLevel.Verbose:
            console.debug('[MSAL]', message);
            break;
        }
      },
      logLevel: LogLevel.Warning,
      piiLoggingEnabled: false,
    },
    allowNativeBroker: false,
  },
};

/**
 * Scopes for login - basic OpenID Connect scopes
 */
export const loginRequest = {
  scopes: ['openid', 'profile', 'email', 'User.Read'],
};

/**
 * Protected resources configuration for HTTP interceptor
 * Add your API endpoints and their required scopes here
 */
export const protectedResources = {
  graphApi: {
    endpoint: 'https://graph.microsoft.com/v1.0/me',
    scopes: ['User.Read'],
  },
  // Example: Add your custom API endpoints here
  // customApi: {
  //   endpoint: 'https://your-api.example.com/api',
  //   scopes: ['api://YOUR_API_CLIENT_ID/access_as_user'],
  // },
};

/**
 * Factory function to create MSAL instance
 * This creates a singleton that will be shared across all MFEs
 */
export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication(msalConfig);
}

/**
 * Guard configuration - controls how login is triggered
 */
export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: loginRequest,
    loginFailedRoute: '/login-failed',
  };
}

/**
 * Interceptor configuration - attaches tokens to HTTP requests
 * The protectedResourceMap defines which endpoints require authentication
 */
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  
  // Add protected endpoints and their required scopes
  protectedResourceMap.set(
    protectedResources.graphApi.endpoint, 
    protectedResources.graphApi.scopes
  );
  
  // Example: Add your custom API
  // protectedResourceMap.set(
  //   protectedResources.customApi.endpoint, 
  //   protectedResources.customApi.scopes
  // );
  
  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}
