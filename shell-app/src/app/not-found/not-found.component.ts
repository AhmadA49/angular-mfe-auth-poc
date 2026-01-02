import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Not Found Component
 * 
 * Displayed for 404 errors - when a route doesn't exist.
 */
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found-container">
      <div class="not-found-card">
        <div class="error-code">404</div>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <a routerLink="/" class="btn btn-primary">
          🏠 Go Home
        </a>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
      padding: 20px;
    }
    
    .not-found-card {
      text-align: center;
      padding: 48px;
    }
    
    .error-code {
      font-size: 8rem;
      font-weight: bold;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
      margin-bottom: 16px;
    }
    
    h2 {
      color: #333;
      margin-bottom: 12px;
    }
    
    p {
      color: #666;
      margin-bottom: 24px;
    }
    
    .btn {
      display: inline-block;
      padding: 12px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s;
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
  `]
})
export class NotFoundComponent {}
