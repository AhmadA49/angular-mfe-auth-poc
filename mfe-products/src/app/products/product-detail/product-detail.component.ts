import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

/**
 * Product interface
 */
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  features?: string[];
}

/**
 * Product Detail Component
 * 
 * Shows detailed product information.
 * Also demonstrates accessing shared auth state.
 */
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="detail-container">
      <a routerLink="../list" class="back-link">← Back to Products</a>
      
      @if (product) {
        <div class="product-detail">
          <div class="product-image">
            <span class="placeholder-icon">📦</span>
          </div>
          
          <div class="product-content">
            <span class="category-tag">{{ product.category }}</span>
            <h1>{{ product.name }}</h1>
            <p class="price">{{ product.price | currency }}</p>
            <p class="description">{{ product.description }}</p>
            
            @if (product.features && product.features.length > 0) {
              <div class="features">
                <h3>Features:</h3>
                <ul>
                  @for (feature of product.features; track feature) {
                    <li>{{ feature }}</li>
                  }
                </ul>
              </div>
            }
            
            @if (currentUser) {
              <div class="user-section">
                <p class="user-info">👤 Logged in as: {{ currentUser }}</p>
                <button class="btn btn-primary" (click)="addToCart()">
                  🛒 Add to Cart
                </button>
              </div>
            } @else {
              <p class="login-prompt">Sign in to add items to your cart</p>
            }
          </div>
        </div>
      } @else {
        <div class="not-found">
          <h2>Product Not Found</h2>
          <p>The product you're looking for doesn't exist.</p>
          <a routerLink="../list" class="btn btn-primary">Browse Products</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .detail-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .back-link {
      display: inline-block;
      margin-bottom: 20px;
      color: #667eea;
      font-weight: 500;
    }
    
    .back-link:hover {
      text-decoration: underline;
    }
    
    .product-detail {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
    }
    
    .product-image {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .placeholder-icon {
      font-size: 8rem;
      opacity: 0.5;
    }
    
    .product-content {
      padding: 32px;
    }
    
    .category-tag {
      display: inline-block;
      background: #f0f0f0;
      color: #666;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.8rem;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    
    h1 {
      margin: 0 0 12px 0;
      color: #333;
      font-size: 1.8rem;
    }
    
    .price {
      font-size: 2rem;
      font-weight: bold;
      color: #667eea;
      margin: 16px 0;
    }
    
    .description {
      color: #666;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    
    .features {
      background: #f9f9f9;
      padding: 16px 20px;
      border-radius: 8px;
      margin-bottom: 24px;
    }
    
    .features h3 {
      margin: 0 0 12px 0;
      font-size: 1rem;
      color: #333;
    }
    
    .features ul {
      margin: 0;
      padding-left: 20px;
    }
    
    .features li {
      margin-bottom: 8px;
      color: #555;
    }
    
    .user-section {
      border-top: 1px solid #eee;
      padding-top: 20px;
    }
    
    .user-info {
      color: #666;
      margin-bottom: 16px;
    }
    
    .login-prompt {
      color: #888;
      font-style: italic;
    }
    
    .btn {
      display: inline-block;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      cursor: pointer;
      border: none;
      font-size: 1rem;
      transition: all 0.3s;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102,126,234,0.4);
      text-decoration: none;
    }
    
    .not-found {
      text-align: center;
      padding: 60px 20px;
    }
    
    .not-found h2 {
      color: #333;
      margin-bottom: 12px;
    }
    
    .not-found p {
      color: #666;
      margin-bottom: 24px;
    }
    
    @media (max-width: 768px) {
      .product-detail {
        grid-template-columns: 1fr;
      }
      
      .product-image {
        min-height: 250px;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private msalService = inject(MsalService);
  
  product: Product | null = null;
  currentUser: string | null = null;
  
  // Sample product database
  private products: Product[] = [
    { 
      id: 1, 
      name: 'Laptop Pro', 
      price: 1299.99, 
      description: 'High-performance laptop designed for professionals. Features a powerful processor, stunning display, and all-day battery life.', 
      category: 'Electronics',
      features: ['16GB RAM', '512GB SSD', '15.6" 4K Display', '12-hour battery life', 'Thunderbolt 4 ports']
    },
    { 
      id: 2, 
      name: 'Smartphone X', 
      price: 899.99, 
      description: 'The latest smartphone featuring cutting-edge technology, an advanced camera system, and blazing-fast 5G connectivity.', 
      category: 'Electronics',
      features: ['6.7" OLED Display', '5G Connectivity', 'Triple Camera System', 'Face ID', 'All-day battery']
    },
    { 
      id: 3, 
      name: 'Wireless Headphones', 
      price: 249.99, 
      description: 'Premium noise-cancelling headphones with exceptional sound quality and comfort for extended listening sessions.', 
      category: 'Electronics',
      features: ['Active Noise Cancellation', '30-hour battery', 'Hi-Res Audio', 'Comfortable ear cups', 'Multipoint connection']
    },
    { 
      id: 4, 
      name: 'Smart Watch', 
      price: 399.99, 
      description: 'Advanced fitness tracking smartwatch with GPS, heart rate monitoring, and seamless smartphone integration.', 
      category: 'Wearables',
      features: ['GPS Tracking', 'Heart Rate Monitor', 'Water Resistant', 'Sleep Tracking', '7-day battery']
    },
    { 
      id: 5, 
      name: 'Tablet Ultra', 
      price: 749.99, 
      description: 'Versatile tablet perfect for work and entertainment with a stunning display and powerful performance.', 
      category: 'Electronics',
      features: ['11" Retina Display', 'Apple M2 Chip', 'Face ID', 'USB-C', 'Works with Apple Pencil']
    },
    { 
      id: 6, 
      name: 'Fitness Band', 
      price: 79.99, 
      description: 'Lightweight and affordable fitness tracker to monitor your daily activity and health metrics.', 
      category: 'Wearables',
      features: ['Step Counter', 'Sleep Monitor', '14-day battery', 'Water Resistant', 'Smartphone notifications']
    },
    { 
      id: 7, 
      name: 'Wireless Keyboard', 
      price: 129.99, 
      description: 'Ergonomic wireless keyboard with responsive keys and multi-device connectivity.', 
      category: 'Accessories',
      features: ['Bluetooth 5.0', 'Rechargeable', 'Backlit keys', 'Multi-device pairing', 'Ergonomic design']
    },
    { 
      id: 8, 
      name: 'USB-C Hub', 
      price: 59.99, 
      description: 'Expand your connectivity with this versatile USB-C hub featuring multiple ports.', 
      category: 'Accessories',
      features: ['4K HDMI', '3 USB-A ports', 'SD Card Reader', 'USB-C PD', 'Compact design']
    },
  ];

  ngOnInit(): void {
    // Get product ID from route
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = parseInt(idParam, 10);
      this.product = this.products.find(p => p.id === id) || null;
    }
    
    // Access shared auth state
    try {
      const account = this.msalService.instance.getActiveAccount();
      if (account) {
        this.currentUser = account.name || account.username;
        console.log('Product Detail - User authenticated:', this.currentUser);
      }
    } catch (error) {
      console.error('Product Detail - Error accessing MSAL:', error);
    }
  }

  addToCart(): void {
    if (this.product && this.currentUser) {
      console.log(`Added ${this.product.name} to cart for user ${this.currentUser}`);
      alert(`${this.product.name} added to cart!`);
    }
  }
}
