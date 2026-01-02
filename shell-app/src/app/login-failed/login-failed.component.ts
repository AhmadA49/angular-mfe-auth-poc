import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';

/**
 * Login Failed Component
 * 
 * Displayed when authentication fails.
 * Provides options to retry login or return home.
 */
@Component({
  selector: 'app-login-failed',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="error-container">
      <div class="error-card">
        <div class="error-icon">❌</div>
        <h2>Login Failed</h2>
        <p>We couldn't sign you in. This might be due to:</p>
        <ul>
          <li>Cancelled login attempt</li>
          <li>Invalid credentials</li>
          <li>Network issues</li>
          <li>Account permissions</li>
        </ul>
        <div class="actions">
          <button class="btn btn-primary" (click)="authService.login()">
            🔄 Try Again
          </button>
          <a routerLink="/" class="btn btn-secondary">
            🏠 Return Home
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .error-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
      padding: 20px;
    }
    
    .error-card {
      background: white;
      padding: 48px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      text-align: center;
      max-width: 450px;
    }
    
    .error-icon {
      font-size: 4rem;
      margin-bottom: 16px;
    }
    
    h2 {
      color: #333;
      margin-bottom: 16px;
    }
    
    p {
      color: #666;
      margin-bottom: 12px;
    }
    
    ul {
      text-align: left;
      color: #666;
      margin-bottom: 24px;
      padding-left: 24px;
    }
    
    li {
      margin-bottom: 8px;
    }
    
    .actions {
      display: flex;
      gap: 12px;
      justify-content: center;
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
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
    
    .btn-secondary {
      background: #f5f5f5;
      color: #333;
    }
    
    .btn-secondary:hover {
      background: #e8e8e8;
      text-decoration: none;
    }
  `]
})
export class LoginFailedComponent {
  authService = inject(AuthService);
}
