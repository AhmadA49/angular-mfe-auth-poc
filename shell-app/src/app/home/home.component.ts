import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';

/**
 * Home Component
 * 
 * Landing page that shows different content based on authentication state.
 * - Unauthenticated: Shows login prompt
 * - Authenticated: Shows welcome message and navigation to MFEs
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      <h1>🏗️ Angular Micro Front-ends POC</h1>
      <p class="subtitle">With Azure Entra ID Authentication & Module Federation</p>

      @if (authService.isAuthenticated()) {
        <div class="welcome-card">
          <h2>Welcome, {{ authService.userDisplayName() }}! 👋</h2>
          <p>You are successfully authenticated via Azure Entra ID.</p>
          <p class="muted">Your JWT token is now federated across all micro front-ends.</p>
          <div class="action-buttons">
            <a routerLink="/products" class="btn btn-primary">🛒 Browse Products</a>
            <a routerLink="/orders" class="btn btn-secondary">📦 View Orders</a>
            <a routerLink="/profile" class="btn btn-outline">👤 My Profile</a>
          </div>
        </div>
      } @else {
        <div class="login-card">
          <h2>Please Sign In</h2>
          <p>Sign in with your Microsoft account to access the application.</p>
          <button class="btn btn-primary btn-large" (click)="authService.login()">
            🔐 Sign In with Microsoft
          </button>
        </div>
      }

      <div class="features">
        <h3>POC Features:</h3>
        <div class="feature-grid">
          <div class="feature-item">
            <span class="icon">✅</span>
            <span>Azure Entra ID Authentication (MSAL)</span>
          </div>
          <div class="feature-item">
            <span class="icon">✅</span>
            <span>JWT Token Federation across MFEs</span>
          </div>
          <div class="feature-item">
            <span class="icon">✅</span>
            <span>Protected Routes with MsalGuard</span>
          </div>
          <div class="feature-item">
            <span class="icon">✅</span>
            <span>HTTP Interceptor for API calls</span>
          </div>
          <div class="feature-item">
            <span class="icon">✅</span>
            <span>Module Federation (Webpack 5)</span>
          </div>
          <div class="feature-item">
            <span class="icon">✅</span>
            <span>Angular Standalone Components</span>
          </div>
        </div>
      </div>

      <div class="architecture">
        <h3>Architecture Overview:</h3>
        <div class="arch-diagram">
          <div class="arch-item shell">
            <strong>Shell App</strong>
            <span>Port 4200</span>
            <small>Handles Auth</small>
          </div>
          <div class="arch-arrow">→</div>
          <div class="arch-remotes">
            <div class="arch-item remote">
              <strong>Products MFE</strong>
              <span>Port 4201</span>
            </div>
            <div class="arch-item remote">
              <strong>Orders MFE</strong>
              <span>Port 4202</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
      text-align: center;
    }
    
    h1 { 
      color: #333; 
      margin-bottom: 8px;
      font-size: 2.5rem;
    }
    
    .subtitle { 
      color: #666; 
      font-size: 1.1rem; 
      margin-bottom: 40px; 
    }
    
    .welcome-card, .login-card {
      background: white;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      margin-bottom: 40px;
    }
    
    .welcome-card h2, .login-card h2 {
      margin-bottom: 12px;
      color: #333;
    }
    
    .muted {
      color: #888;
      font-size: 0.9rem;
      margin-top: 8px;
    }
    
    .action-buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-top: 24px;
      flex-wrap: wrap;
    }
    
    .btn {
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: all 0.3s;
      font-size: 1rem;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .btn-primary:hover { 
      transform: translateY(-2px); 
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      text-decoration: none;
    }
    
    .btn-secondary {
      background: #f5f5f5;
      color: #333;
    }
    
    .btn-secondary:hover {
      background: #e8e8e8;
      text-decoration: none;
    }
    
    .btn-outline {
      background: transparent;
      border: 2px solid #667eea;
      color: #667eea;
    }
    
    .btn-outline:hover {
      background: rgba(102, 126, 234, 0.1);
      text-decoration: none;
    }
    
    .btn-large { 
      font-size: 1.1rem; 
      padding: 16px 32px; 
    }
    
    .features {
      background: white;
      padding: 32px;
      border-radius: 12px;
      margin-bottom: 30px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }
    
    .features h3 { 
      margin-bottom: 20px;
      color: #333;
    }
    
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 12px;
      text-align: left;
    }
    
    .feature-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      background: #f9f9f9;
      border-radius: 8px;
    }
    
    .feature-item .icon {
      font-size: 1.2rem;
    }
    
    .architecture {
      background: white;
      padding: 32px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }
    
    .architecture h3 {
      margin-bottom: 24px;
      color: #333;
    }
    
    .arch-diagram {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
    }
    
    .arch-item {
      padding: 20px;
      border-radius: 12px;
      text-align: center;
    }
    
    .arch-item strong {
      display: block;
      margin-bottom: 4px;
    }
    
    .arch-item span {
      font-size: 0.9rem;
      color: #666;
    }
    
    .arch-item small {
      display: block;
      font-size: 0.8rem;
      color: #888;
      margin-top: 4px;
    }
    
    .arch-item.shell {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .arch-item.shell span,
    .arch-item.shell small {
      color: rgba(255, 255, 255, 0.8);
    }
    
    .arch-item.remote {
      background: #f5f5f5;
      border: 2px solid #e0e0e0;
    }
    
    .arch-arrow {
      font-size: 2rem;
      color: #667eea;
    }
    
    .arch-remotes {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    @media (max-width: 768px) {
      h1 {
        font-size: 1.8rem;
      }
      
      .action-buttons {
        flex-direction: column;
      }
      
      .btn {
        width: 100%;
      }
    }
  `]
})
export class HomeComponent {
  authService = inject(AuthService);
}
