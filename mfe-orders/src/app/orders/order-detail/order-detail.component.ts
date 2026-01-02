import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

/**
 * Order item interface
 */
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

/**
 * Order interface
 */
interface Order {
  id: number;
  date: Date;
  status: 'Delivered' | 'Processing' | 'Pending' | 'Shipped' | 'Cancelled';
  total: number;
  items: OrderItem[];
  trackingNumber?: string;
  shippingAddress: string;
  estimatedDelivery?: Date;
}

/**
 * Order Detail Component
 * 
 * Shows detailed order information including items, shipping, and tracking.
 * Demonstrates accessing shared authentication state.
 */
@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="detail-container">
      <a routerLink="../list" class="back-link">← Back to Orders</a>
      
      @if (order) {
        <div class="order-header">
          <div class="order-title">
            <h1>Order #{{ order.id }}</h1>
            <span class="status" [class]="order.status.toLowerCase()">
              {{ getStatusIcon(order.status) }} {{ order.status }}
            </span>
          </div>
          <p class="order-date">Placed on {{ order.date | date:'fullDate' }}</p>
        </div>

        <div class="order-grid">
          <!-- Order Items -->
          <div class="card items-card">
            <h3>Order Items</h3>
            <div class="items-list">
              @for (item of order.items; track item.name) {
                <div class="item-row">
                  <div class="item-icon">📦</div>
                  <div class="item-details">
                    <span class="item-name">{{ item.name }}</span>
                    <span class="item-qty">Qty: {{ item.quantity }}</span>
                  </div>
                  <span class="item-price">{{ item.price * item.quantity | currency }}</span>
                </div>
              }
            </div>
            <div class="order-total">
              <span>Total</span>
              <span class="total-amount">{{ order.total | currency }}</span>
            </div>
          </div>

          <!-- Shipping Info -->
          <div class="card shipping-card">
            <h3>Shipping Information</h3>
            <div class="shipping-details">
              <div class="detail-row">
                <span class="label">Address</span>
                <span class="value">{{ order.shippingAddress }}</span>
              </div>
              @if (order.trackingNumber) {
                <div class="detail-row">
                  <span class="label">Tracking Number</span>
                  <span class="value tracking">{{ order.trackingNumber }}</span>
                </div>
              }
              @if (order.estimatedDelivery) {
                <div class="detail-row">
                  <span class="label">Estimated Delivery</span>
                  <span class="value">{{ order.estimatedDelivery | date:'fullDate' }}</span>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Timeline -->
        <div class="card timeline-card">
          <h3>Order Timeline</h3>
          <div class="timeline">
            <div class="timeline-item" [class.active]="true">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <span class="timeline-title">Order Placed</span>
                <span class="timeline-date">{{ order.date | date:'medium' }}</span>
              </div>
            </div>
            <div class="timeline-item" [class.active]="order.status !== 'Pending' && order.status !== 'Cancelled'">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <span class="timeline-title">Processing</span>
              </div>
            </div>
            <div class="timeline-item" [class.active]="order.status === 'Shipped' || order.status === 'Delivered'">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <span class="timeline-title">Shipped</span>
              </div>
            </div>
            <div class="timeline-item" [class.active]="order.status === 'Delivered'">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <span class="timeline-title">Delivered</span>
              </div>
            </div>
          </div>
        </div>

        @if (currentUser) {
          <div class="user-actions">
            <p class="user-info">👤 Logged in as: {{ currentUser }}</p>
            @if (order.status === 'Pending') {
              <button class="btn btn-danger" (click)="cancelOrder()">Cancel Order</button>
            }
            @if (order.status === 'Delivered') {
              <button class="btn btn-primary" (click)="reorder()">Order Again</button>
            }
          </div>
        }
      } @else {
        <div class="not-found">
          <h2>Order Not Found</h2>
          <p>The order you're looking for doesn't exist.</p>
          <a routerLink="../list" class="btn btn-primary">View All Orders</a>
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
    
    .order-header {
      margin-bottom: 24px;
    }
    
    .order-title {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }
    
    .order-title h1 {
      margin: 0;
      color: #333;
    }
    
    .order-date {
      color: #666;
      margin: 0;
    }
    
    .status {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 500;
    }
    
    .status.delivered { background: #e8f5e9; color: #2e7d32; }
    .status.pending { background: #fff3e0; color: #ef6c00; }
    .status.processing { background: #e3f2fd; color: #1565c0; }
    .status.shipped { background: #f3e5f5; color: #7b1fa2; }
    .status.cancelled { background: #ffebee; color: #c62828; }
    
    .order-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .card h3 {
      margin: 0 0 16px 0;
      color: #333;
      font-size: 1.1rem;
    }
    
    .items-list {
      border-bottom: 1px solid #eee;
      padding-bottom: 16px;
      margin-bottom: 16px;
    }
    
    .item-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #f5f5f5;
    }
    
    .item-row:last-child {
      border-bottom: none;
    }
    
    .item-icon {
      font-size: 1.5rem;
    }
    
    .item-details {
      flex: 1;
    }
    
    .item-name {
      display: block;
      font-weight: 500;
      color: #333;
    }
    
    .item-qty {
      font-size: 0.85rem;
      color: #666;
    }
    
    .item-price {
      font-weight: 600;
      color: #333;
    }
    
    .order-total {
      display: flex;
      justify-content: space-between;
      font-size: 1.1rem;
    }
    
    .total-amount {
      font-weight: bold;
      color: #667eea;
      font-size: 1.3rem;
    }
    
    .detail-row {
      margin-bottom: 16px;
    }
    
    .detail-row:last-child {
      margin-bottom: 0;
    }
    
    .label {
      display: block;
      font-size: 0.8rem;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    
    .value {
      color: #333;
    }
    
    .value.tracking {
      font-family: monospace;
      background: #f5f5f5;
      padding: 4px 8px;
      border-radius: 4px;
    }
    
    .timeline-card {
      margin-bottom: 20px;
    }
    
    .timeline {
      display: flex;
      justify-content: space-between;
      position: relative;
    }
    
    .timeline::before {
      content: '';
      position: absolute;
      top: 12px;
      left: 0;
      right: 0;
      height: 2px;
      background: #e0e0e0;
      z-index: 0;
    }
    
    .timeline-item {
      position: relative;
      z-index: 1;
      text-align: center;
      flex: 1;
    }
    
    .timeline-dot {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #e0e0e0;
      margin: 0 auto 8px;
      border: 3px solid white;
      box-shadow: 0 0 0 2px #e0e0e0;
    }
    
    .timeline-item.active .timeline-dot {
      background: #667eea;
      box-shadow: 0 0 0 2px #667eea;
    }
    
    .timeline-title {
      display: block;
      font-weight: 500;
      font-size: 0.9rem;
      color: #666;
    }
    
    .timeline-item.active .timeline-title {
      color: #333;
    }
    
    .timeline-date {
      font-size: 0.75rem;
      color: #999;
    }
    
    .user-actions {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }
    
    .user-info {
      color: #666;
      margin: 0;
    }
    
    .btn {
      padding: 10px 24px;
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
      box-shadow: 0 4px 12px rgba(102,126,234,0.4);
    }
    
    .btn-danger {
      background: #dc3545;
      color: white;
    }
    
    .btn-danger:hover {
      background: #c82333;
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
      .order-grid {
        grid-template-columns: 1fr;
      }
      
      .timeline {
        flex-direction: column;
        gap: 12px;
      }
      
      .timeline::before {
        display: none;
      }
      
      .timeline-item {
        display: flex;
        align-items: center;
        text-align: left;
        gap: 12px;
      }
      
      .timeline-dot {
        margin: 0;
      }
    }
  `]
})
export class OrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private msalService = inject(MsalService);
  
  order: Order | null = null;
  currentUser: string | null = null;
  
  // Sample order database
  private orders: Order[] = [
    { 
      id: 1001, 
      date: new Date('2024-01-15'), 
      status: 'Delivered', 
      total: 1549.98, 
      items: [
        { name: 'Laptop Pro', quantity: 1, price: 1299.99 },
        { name: 'Wireless Headphones', quantity: 1, price: 249.99 }
      ],
      trackingNumber: 'TRK123456789',
      shippingAddress: '123 Main Street, San Francisco, CA 94102',
      estimatedDelivery: new Date('2024-01-20')
    },
    { 
      id: 1002, 
      date: new Date('2024-01-18'), 
      status: 'Processing', 
      total: 899.99, 
      items: [
        { name: 'Smartphone X', quantity: 1, price: 899.99 }
      ],
      shippingAddress: '456 Oak Avenue, Los Angeles, CA 90001',
      estimatedDelivery: new Date('2024-01-28')
    },
    { 
      id: 1003, 
      date: new Date('2024-01-20'), 
      status: 'Pending', 
      total: 249.99, 
      items: [
        { name: 'Wireless Headphones', quantity: 1, price: 249.99 }
      ],
      shippingAddress: '789 Pine Road, Seattle, WA 98101'
    },
    { 
      id: 1004, 
      date: new Date('2024-01-22'), 
      status: 'Shipped', 
      total: 479.98, 
      items: [
        { name: 'Smart Watch', quantity: 1, price: 399.99 },
        { name: 'Fitness Band', quantity: 1, price: 79.99 }
      ],
      trackingNumber: 'TRK987654321',
      shippingAddress: '321 Elm Street, New York, NY 10001',
      estimatedDelivery: new Date('2024-01-30')
    },
  ];

  ngOnInit(): void {
    // Get order ID from route
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = parseInt(idParam, 10);
      this.order = this.orders.find(o => o.id === id) || null;
    }
    
    // Access shared auth state
    try {
      const account = this.msalService.instance.getActiveAccount();
      if (account) {
        this.currentUser = account.name || account.username;
        console.log('Order Detail - User authenticated:', this.currentUser);
      }
    } catch (error) {
      console.error('Order Detail - Error accessing MSAL:', error);
    }
  }

  getStatusIcon(status: Order['status']): string {
    const icons: Record<Order['status'], string> = {
      'Delivered': '✅',
      'Processing': '⚙️',
      'Pending': '⏳',
      'Shipped': '🚚',
      'Cancelled': '❌'
    };
    return icons[status];
  }

  cancelOrder(): void {
    if (this.order && this.currentUser) {
      console.log(`Cancelling order #${this.order.id} for user ${this.currentUser}`);
      alert(`Order #${this.order.id} has been cancelled.`);
    }
  }

  reorder(): void {
    if (this.order && this.currentUser) {
      console.log(`Reordering items from order #${this.order.id} for user ${this.currentUser}`);
      alert(`Items from order #${this.order.id} added to your cart!`);
    }
  }
}
