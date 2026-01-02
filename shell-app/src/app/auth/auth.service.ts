import { Injectable, inject, signal, computed } from '@angular/core';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { 
  EventMessage, 
  EventType, 
  InteractionStatus,
  AccountInfo,
  AuthenticationResult 
} from '@azure/msal-browser';
import { Subject, filter, takeUntil } from 'rxjs';
import { loginRequest } from './auth-config';

/**
 * User profile interface representing authenticated user data
 */
export interface UserProfile {
  name: string;
  email: string;
  username: string;
  tenantId: string;
  roles?: string[];
}

/**
 * AuthService - Main authentication service for the Shell application
 * 
 * This service:
 * - Manages authentication state using Angular signals
 * - Handles MSAL events (login, logout, token acquisition)
 * - Provides methods for login/logout operations
 * - Exposes reactive authentication state for components
 * 
 * The MSAL instance is shared across all MFEs via Module Federation,
 * so authentication state is automatically federated.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private msalService = inject(MsalService);
  private msalBroadcastService = inject(MsalBroadcastService);
  private readonly _destroying$ = new Subject<void>();

  // Reactive state using Angular signals
  private _isAuthenticated = signal(false);
  private _user = signal<UserProfile | null>(null);
  private _isLoading = signal(true);

  // Public readonly signals for components to consume
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  
  // Computed values
  readonly userDisplayName = computed(() => this._user()?.name ?? 'Guest');

  constructor() {
    this.initializeAuth();
  }

  /**
   * Initialize authentication handling
   * Sets up MSAL event subscriptions and handles redirect callbacks
   */
  private initializeAuth(): void {
    // Handle redirect callback from Azure AD
    this.msalService.handleRedirectObservable().subscribe({
      next: (result: AuthenticationResult | null) => {
        if (result) {
          console.log('Auth redirect completed successfully');
          this.setActiveAccount(result.account);
        }
        this.checkAuthentication();
      },
      error: (error) => {
        console.error('Redirect error:', error);
        this._isLoading.set(false);
      }
    });

    // Subscribe to MSAL interaction status changes
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.checkAuthentication();
        this._isLoading.set(false);
      });

    // Listen for login success events
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
        takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
        console.log('Login success event received');
        const payload = result.payload as AuthenticationResult;
        this.setActiveAccount(payload.account);
      });

    // Listen for logout events
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGOUT_SUCCESS),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        console.log('Logout success event received');
        this._isAuthenticated.set(false);
        this._user.set(null);
      });

    // Listen for acquire token success (silent token refresh)
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS),
        takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
        console.log('Token acquired/refreshed successfully');
      });
  }

  /**
   * Check current authentication status
   * Called after redirect and on interaction completion
   */
  private checkAuthentication(): void {
    const accounts = this.msalService.instance.getAllAccounts();
    
    if (accounts.length > 0) {
      // Use active account if set, otherwise use first account
      const activeAccount = this.msalService.instance.getActiveAccount() || accounts[0];
      this.setActiveAccount(activeAccount);
    } else {
      this._isAuthenticated.set(false);
      this._user.set(null);
    }
  }

  /**
   * Set the active account and update user state
   */
  private setActiveAccount(account: AccountInfo | null): void {
    if (account) {
      this.msalService.instance.setActiveAccount(account);
      this._isAuthenticated.set(true);
      this._user.set({
        name: account.name || 'Unknown',
        email: account.username,
        username: account.username,
        tenantId: account.tenantId,
        // Extract roles from token claims if available
        roles: (account.idTokenClaims as any)?.roles || [],
      });
      console.log('User authenticated:', account.name);
    }
  }

  // ==========================================
  // Public Methods
  // ==========================================

  /**
   * Initiate login via redirect
   */
  login(): void {
    console.log('Initiating login redirect...');
    this.msalService.loginRedirect(loginRequest);
  }

  /**
   * Initiate login via popup
   * Useful for scenarios where redirect is not desired
   */
  loginPopup(): void {
    console.log('Initiating login popup...');
    this.msalService.loginPopup(loginRequest).subscribe({
      next: (result) => {
        console.log('Popup login successful');
        this.setActiveAccount(result.account);
      },
      error: (error) => console.error('Login popup error:', error)
    });
  }

  /**
   * Logout the user
   */
  logout(): void {
    console.log('Initiating logout...');
    this.msalService.logoutRedirect({
      postLogoutRedirectUri: '/'
    });
  }

  /**
   * Get access token for API calls
   * This method can be used in MFEs to acquire tokens silently
   */
  async getAccessToken(scopes: string[]): Promise<string | null> {
    try {
      const account = this.msalService.instance.getActiveAccount();
      if (!account) {
        console.warn('No active account found for token acquisition');
        return null;
      }

      const response = await this.msalService.instance.acquireTokenSilent({
        scopes,
        account,
      });
      return response.accessToken;
    } catch (error) {
      console.error('Token acquisition error:', error);
      // Could trigger interactive login here if silent fails
      return null;
    }
  }

  /**
   * Get current account info
   */
  getAccount(): AccountInfo | null {
    return this.msalService.instance.getActiveAccount();
  }

  /**
   * Check if user has a specific role (from JWT claims)
   */
  hasRole(role: string): boolean {
    const user = this._user();
    return user?.roles?.includes(role) ?? false;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    const user = this._user();
    if (!user?.roles) return false;
    return roles.some(role => user.roles?.includes(role));
  }

  /**
   * Cleanup on service destruction
   */
  destroy(): void {
    this._destroying$.next();
    this._destroying$.complete();
  }
}
