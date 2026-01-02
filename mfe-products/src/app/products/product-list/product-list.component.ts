import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';

/**
 * Product interface
 */
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl?: string;
}

/**
 * Product List Component
 * 
 * This component demonstrates how MFEs can access the shared MSAL instance
 * from the Shell application. The authentication state is federated via
 * Module Federation's singleton sharing.
 * 
 * Key features:
 * - Accesses shared MSAL service to get authenticated user
 * - Can acquire tokens silently for API calls
 * - Displays user info to prove auth state is shared
 */
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="products-container">
      <div class="header">
        <h2>🛒 Products Micro Front-end</h2>
        
        <!-- Display authenticated user from shared MSAL context -->
        @if (currentUser) {
          <div class="auth-info">
            <span class="badge badge-success">✅ Authenticated as: {{ currentUser }}</span>
          </div>
        } @else {
          <div class="auth-info">
            <span class="badge badge-warning">⚠️ Not authenticated</span>
          </div>
        }
      </div>

      <p class="description">
        This micro front-end receives authentication state from the Shell application
        via Module Federation's shared MSAL instance.
      </p>

      <!-- Category Filter -->
      <div class="filter-section">
        <label>Filter by category:</label>
        <select (change)="filterByCategory($event)">
          <option value="">All Categories</option>
          @for (category of categories; track category) {
            <option [value]="category">{{ category }}</option>
          }
        </select>
      </div>

      <!-- Product Grid -->
      <div class="product-grid">
        @for (product of filteredProducts; track product.id) {
          <div class="product-card">
            <div class="product-image">
              <span class="placeholder-icon">📦</span>
            </div>
            <div class="product-info">
              <span class="category-tag">{{ product.category }}</span>
              <h3>{{ product.name }}</h3>
              <p class="price">{{ product.price | currency }}</p>
              <p class="description">{{ product.description }}</p>
              <a [routerLink]="['../detail', product.id]" class="btn btn-primary">
                View Details
              </a>
            </div>
          </div>
        }
      </div>

      @if (filteredProducts.length === 0) {
        <div class="no-products">
          <p>No products found in this category.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .products-container { 
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center;
      margin-bottom: 16px;
      flex-wrap: wrap;
      gap: 12px;
    }
    
    .header h2 {
      margin: 0;
      color: #333;
    }
    
    .auth-info { 
      background: white;
      padding: 8px 16px; 
      border-radius: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .badge {
      font-size: 0.9rem;
      font-weight: 500;
    }
    
    .badge-success { color: #2e7d32; }
    .badge-warning { color: #ef6c00; }
    
    .description {
      color: #666;
      margin-bottom: 24px;
      background: #f5f5f5;
      padding: 12px 16px;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }
    
    .filter-section {
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .filter-section label {
      font-weight: 500;
      color: #555;
    }
    
    .filter-section select {
      padding: 8px 16px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      background: white;
      cursor: pointer;
    }
    
    .product-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
      gap: 24px; 
    }
    
    .product-card { 
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }
    
    .product-image {
      height: 160px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .placeholder-icon {
      font-size: 4rem;
      opacity: 0.5;
    }
    
    .product-info {
      padding: 20px;
    }
    
    .category-tag {
      display: inline-block;
      background: #f0f0f0;
      color: #666;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.75rem;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    
    .product-info h3 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 1.1rem;
    }
    
    .price { 
      font-size: 1.5rem; 
      font-weight: bold; 
      color: #667eea;
      margin: 8px 0;
    }
    
    .product-info .description { 
      color: #666; 
      margin: 12px 0;
      font-size: 0.9rem;
      background: none;
      padding: 0;
      border: none;
    }
    
    .btn {
      display: inline-block;
      padding: 10px 20px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s;
      cursor: pointer;
      border: none;
      font-size: 0.9rem;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .btn-primary:hover { 
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102,126,234,0.4);
      text-decoration: none;
    }
    
    .no-products {
      text-align: center;
      padding: 48px;
      color: #666;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .filter-section {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class ProductListComponent implements OnInit {
  // Inject the shared MSAL service - this is the same instance from the Shell!
  private msalService = inject(MsalService);
  private http = inject(HttpClient);
  
  currentUser: string | null = null;
  selectedCategory: string = '';
  
  // Sample product data
  products: Product[] = [
    { id: 1, name: 'Laptop Pro', price: 1299.99, description: 'High-performance laptop for professionals', category: 'Electronics' },
    { id: 2, name: 'Smartphone X', price: 899.99, description: 'Latest smartphone with advanced features', category: 'Electronics' },
    { id: 3, name: 'Wireless Headphones', price: 249.99, description: 'Noise-cancelling headphones with premium sound', category: 'Electronics' },
    { id: 4, name: 'Smart Watch', price: 399.99, description: 'Fitness tracking smartwatch with GPS', category: 'Wearables' },
    { id: 5, name: 'Tablet Ultra', price: 749.99, description: 'Portable tablet for work and entertainment', category: 'Electronics' },
    { id: 6, name: 'Fitness Band', price: 79.99, description: 'Lightweight fitness tracker', category: 'Wearables' },
    { id: 7, name: 'Wireless Keyboard', price: 129.99, description: 'Ergonomic wireless keyboard', category: 'Accessories' },
    { id: 8, name: 'USB-C Hub', price: 59.99, description: 'Multi-port USB-C hub for connectivity', category: 'Accessories' },
  ];

  categories: string[] = ['Electronics', 'Wearables', 'Accessories'];
  
  get filteredProducts(): Product[] {
    if (!this.selectedCategory) {
      return this.products;
    }
    return this.products.filter(p => p.category === this.selectedCategory);
  }

  ngOnInit(): void {
    // Access the shared MSAL instance - auth state is federated from the Shell!
    try {
      const account = this.msalService.instance.getActiveAccount();
      if (account) {
        this.currentUser = account.name || account.username;
        console.log('Products MFE - User authenticated:', this.currentUser);
        console.log('Products MFE - Account details:', {
          name: account.name,
          username: account.username,
          tenantId: account.tenantId,
        });
        
        // Demonstrate that we can acquire tokens in the MFE
        this.logTokenInfo();
      } else {
        console.log('Products MFE - No active account found');
      }
    } catch (error) {
      console.error('Products MFE - Error accessing MSAL:', error);
    }
  }

  /**
   * Demonstrate token acquisition in the MFE
   * This works because MSAL is shared as a singleton
   */
  private async logTokenInfo(): Promise<void> {
    try {
      const account = this.msalService.instance.getActiveAccount();
      if (account) {
        // Silently acquire token - works because MSAL is shared singleton
        const response = await this.msalService.instance.acquireTokenSilent({
          scopes: ['User.Read'],
          account: account,
        });
        console.log('Products MFE - Access Token acquired successfully');
        console.log('Products MFE - Token preview:', response.accessToken.substring(0, 50) + '...');
      }
    } catch (error) {
      console.error('Products MFE - Token acquisition failed:', error);
    }
  }

  filterByCategory(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedCategory = select.value;
  }
}
