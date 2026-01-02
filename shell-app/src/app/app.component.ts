import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './layout/header/header.component';
import { AuthService } from './auth/auth.service';

/**
 * Root Application Component
 * 
 * Shows a loading overlay while authentication state is being determined,
 * then displays the header and router outlet.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  template: `
    @if (authService.isLoading()) {
      <div class="loading-overlay">
        <div class="spinner"></div>
        <p>Authenticating...</p>
      </div>
    } @else {
      <app-header></app-header>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    }
  `,
  styles: [`
    .main-content {
      padding: 20px;
      min-height: calc(100vh - 80px);
    }
    
    .loading-overlay {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    .loading-overlay p {
      margin-top: 20px;
      font-size: 1.1rem;
      font-weight: 500;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class AppComponent {
  authService = inject(AuthService);
}
