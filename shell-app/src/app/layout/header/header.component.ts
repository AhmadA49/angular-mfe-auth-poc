import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

/**
 * Header Component
 * 
 * Displays navigation and authentication controls.
 * Shows different navigation items based on authentication state.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="logo">
        <a routerLink="/home">🏠 MFE Shell</a>
      </div>
      
      <ul class="nav-links">
        <li><a routerLink="/home" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a></li>
        @if (authService.isAuthenticated()) {
          <li><a routerLink="/products" routerLinkActive="active">Products</a></li>
          <li><a routerLink="/orders" routerLinkActive="active">Orders</a></li>
          <li><a routerLink="/profile" routerLinkActive="active">Profile</a></li>
        }
      </ul>

      <div class="auth-section">
        @if (authService.isAuthenticated()) {
          <span class="user-info">
            👤 {{ authService.userDisplayName() }}
          </span>
          <button class="btn btn-logout" (click)="authService.logout()">
            Sign Out
          </button>
        } @else {
          <button class="btn btn-login" (click)="authService.login()">
            Sign In with Microsoft
          </button>
        }
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .logo a { 
      color: white; 
      text-decoration: none; 
      font-size: 1.5rem; 
      font-weight: bold;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .logo a:hover {
      text-decoration: none;
    }
    
    .nav-links {
      display: flex;
      list-style: none;
      gap: 0.5rem;
      margin: 0;
      padding: 0;
    }
    
    .nav-links a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      transition: background 0.3s;
      font-weight: 500;
    }
    
    .nav-links a:hover {
      background: rgba(255, 255, 255, 0.2);
      text-decoration: none;
    }
    
    .nav-links a.active {
      background: rgba(255, 255, 255, 0.25);
    }
    
    .auth-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .user-info {
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.1);
      padding: 6px 12px;
      border-radius: 20px;
    }
    
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
      font-size: 0.9rem;
    }
    
    .btn-login {
      background: white;
      color: #667eea;
    }
    
    .btn-login:hover {
      background: #f0f0f0;
      transform: translateY(-1px);
    }
    
    .btn-logout {
      background: rgba(255, 255, 255, 0.15);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.5);
    }
    
    .btn-logout:hover {
      background: rgba(255, 255, 255, 0.25);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .navbar {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }
      
      .nav-links {
        flex-wrap: wrap;
        justify-content: center;
      }
      
      .auth-section {
        flex-direction: column;
      }
    }
  `]
})
export class HeaderComponent {
  authService = inject(AuthService);
}
