import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MsalService } from '@azure/msal-angular';
import { AuthService } from '../auth/auth.service';

/**
 * Microsoft Graph API profile response interface
 */
interface GraphProfile {
  displayName: string;
  mail: string;
  jobTitle: string;
  officeLocation: string;
  userPrincipalName: string;
}

/**
 * Profile Component
 * 
 * Displays user information from:
 * 1. MSAL Token Claims (immediate, no API call)
 * 2. Microsoft Graph API (optional, demonstrates token usage)
 * 
 * Also allows viewing the raw JWT access token.
 */
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <h2>👤 User Profile</h2>
      
      <!-- Profile from Token Claims -->
      <div class="profile-card">
        <h3>From MSAL Token Claims</h3>
        <p class="card-description">This data is extracted from the JWT token claims - no API call required.</p>
        @if (authService.user(); as user) {
          <div class="info-grid">
            <div class="info-item">
              <label>Name</label>
              <span>{{ user.name }}</span>
            </div>
            <div class="info-item">
              <label>Email</label>
              <span>{{ user.email }}</span>
            </div>
            <div class="info-item">
              <label>Tenant ID</label>
              <span class="monospace">{{ user.tenantId }}</span>
            </div>
            @if (user.roles && user.roles.length > 0) {
              <div class="info-item">
                <label>Roles</label>
                <span>{{ user.roles.join(', ') }}</span>
              </div>
            }
          </div>
        }
      </div>

      <!-- Profile from Graph API -->
      <div class="profile-card">
        <h3>From Microsoft Graph API</h3>
        <p class="card-description">
          This fetches data from the Graph API. The HTTP interceptor automatically attaches the JWT token.
        </p>
        <button class="btn btn-primary" (click)="loadGraphProfile()" [disabled]="isLoading()">
          {{ isLoading() ? 'Loading...' : '🔄 Fetch Graph Profile' }}
        </button>
        
        @if (graphError()) {
          <div class="error-message">
            ⚠️ {{ graphError() }}
          </div>
        }
        
        @if (graphProfile()) {
          <div class="info-grid">
            <div class="info-item">
              <label>Display Name</label>
              <span>{{ graphProfile()!.displayName }}</span>
            </div>
            <div class="info-item">
              <label>Email</label>
              <span>{{ graphProfile()!.mail || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <label>Job Title</label>
              <span>{{ graphProfile()!.jobTitle || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <label>Office</label>
              <span>{{ graphProfile()!.officeLocation || 'N/A' }}</span>
            </div>
            <div class="info-item full-width">
              <label>Principal Name</label>
              <span>{{ graphProfile()!.userPrincipalName }}</span>
            </div>
          </div>
        }
      </div>

      <!-- JWT Token Section -->
      <div class="profile-card token-section">
        <h3>🔐 JWT Token Info</h3>
        <p class="card-description">
          View your current access token. This token is shared across all MFEs via Module Federation.
        </p>
        <button class="btn btn-secondary" (click)="showToken()">
          {{ accessToken() ? 'Refresh Token' : 'Show Access Token' }}
        </button>
        @if (accessToken()) {
          <div class="token-info">
            <label>Access Token (first 100 chars):</label>
            <pre class="token-display">{{ accessToken()!.substring(0, 100) }}...</pre>
            <p class="token-hint">
              💡 Tip: Copy the full token and decode it at 
              <a href="https://jwt.io" target="_blank">jwt.io</a> to see the claims.
            </p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .profile-container { 
      padding: 20px; 
      max-width: 800px; 
      margin: 0 auto; 
    }
    
    h2 {
      margin-bottom: 24px;
      color: #333;
    }
    
    .profile-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .profile-card h3 { 
      margin-top: 0; 
      margin-bottom: 8px;
      color: #333; 
    }
    
    .card-description {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 16px;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }
    
    .info-item {
      background: #f9f9f9;
      padding: 12px;
      border-radius: 8px;
    }
    
    .info-item.full-width {
      grid-column: 1 / -1;
    }
    
    .info-item label {
      display: block;
      font-size: 0.8rem;
      color: #666;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .info-item span {
      font-size: 1rem;
      color: #333;
      word-break: break-word;
    }
    
    .info-item .monospace {
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 0.85rem;
    }
    
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
    }
    
    .btn:disabled { 
      opacity: 0.6;
      cursor: not-allowed; 
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) { 
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
    }
    
    .btn-secondary {
      background: #f5f5f5;
      color: #333;
      border: 1px solid #ddd;
    }
    
    .btn-secondary:hover:not(:disabled) { 
      background: #e8e8e8; 
    }
    
    .error-message {
      margin-top: 12px;
      padding: 12px;
      background: #ffebee;
      color: #c62828;
      border-radius: 8px;
      font-size: 0.9rem;
    }
    
    .token-section {
      background: #fafafa;
    }
    
    .token-info {
      margin-top: 16px;
    }
    
    .token-info label {
      display: block;
      font-size: 0.85rem;
      color: #666;
      margin-bottom: 8px;
    }
    
    .token-display {
      background: #1e1e1e;
      color: #9cdcfe;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      font-size: 0.8rem;
      font-family: 'Monaco', 'Menlo', monospace;
      word-break: break-all;
      white-space: pre-wrap;
    }
    
    .token-hint {
      margin-top: 12px;
      font-size: 0.85rem;
      color: #666;
    }
    
    .token-hint a {
      color: #667eea;
    }
  `]
})
export class ProfileComponent {
  authService = inject(AuthService);
  private http = inject(HttpClient);
  private msalService = inject(MsalService);

  graphProfile = signal<GraphProfile | null>(null);
  accessToken = signal<string | null>(null);
  isLoading = signal(false);
  graphError = signal<string | null>(null);

  /**
   * Load user profile from Microsoft Graph API
   * The HTTP interceptor automatically attaches the JWT token
   */
  async loadGraphProfile(): Promise<void> {
    this.isLoading.set(true);
    this.graphError.set(null);
    
    try {
      const profile = await this.http
        .get<GraphProfile>('https://graph.microsoft.com/v1.0/me')
        .toPromise();
      this.graphProfile.set(profile!);
    } catch (error: any) {
      console.error('Error loading Graph profile:', error);
      this.graphError.set(
        error.message || 'Failed to load profile from Microsoft Graph API'
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Retrieve and display the current access token
   */
  async showToken(): Promise<void> {
    const account = this.msalService.instance.getActiveAccount();
    if (account) {
      try {
        const response = await this.msalService.instance.acquireTokenSilent({
          scopes: ['User.Read'],
          account,
        });
        this.accessToken.set(response.accessToken);
        console.log('Full access token available in console for debugging');
        console.log('Access Token:', response.accessToken);
      } catch (error) {
        console.error('Token acquisition error:', error);
      }
    }
  }
}
