import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

/**
 * Order interface
 */
interface Order {
  id: number;
  date: Date;
  status: 'Delivered' | 'Processing' | 'Pending' | 'Shipped' | 'Cancelled';
  total: number;
  items: number;
  trackingNumber?: string;
}

/**
 * Order List Component
 * 
 * This component demonstrates how the Orders MFE accesses shared authentication
 * from the Shell application via Module Federation's singleton MSAL instance.
 * 
 * Key features:
 * - Accesses shared MSAL service to get authenticated user
 * - Displays user-specific order history
 * - Shows authentication status to prove JWT federation is working
 */
@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="orders-container">
      <div class="header">
        <h2>📦 Orders Micro Front-end</h2>
        @if (currentUser) {
          <div class="auth-info">
            <span class="badge badge-info">✅ Viewing orders for: {{ currentUser }}</span>
          </div>
        } @else {
          <div class="auth-info">
            <span class="badge badge-warning">⚠️ Not authenticated</span>
          </div>
        }
      </div>

      <p class="description">
        This micro front-end receives authentication state from the Shell application.
        Orders are filtered based on the authenticated user.
      </p>

      <!-- Order Statistics -->
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-value">{{ orders.length }}</span>
          <span class="stat-label">Total Orders</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ getOrdersByStatus('Delivered').length }}</span>
          <span class="stat-label">Delivered</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ getOrdersByStatus('Processing').length + getOrdersByStatus('Shipped').length }}</span>
          <span class="stat-label">In Transit</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ totalSpent | currency }}</span>
          <span class="stat-label">Total Spent</span>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="table-container">
        <table class="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Items</th>
              <th>Status</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (order of orders; track order.id) {
              <tr>
                <td class="order-id">#{{ order.id }}</td>
                <td>{{ order.date | date:'mediumDate' }}</td>
                <td>{{ order.items }} items</td>
                <td>
                  <span class="status" [class]="getStatusClass(order.status)">
                    {{ getStatusIcon(order.status) }} {{ order.status }}
                  </span>
                </td>
                <td class="total">{{ order.total | currency }}</td>
                <td>
                  <a [routerLink]="['../detail', order.id]" class="btn btn-small">
                    View Details
                  </a>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      @if (orders.length === 0) {
        <div class="no-orders">
          <p>No orders found.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .orders-container { 
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
    
    .badge-info { color: #1565c0; }
    .badge-warning { color: #ef6c00; }
    
    .description {
      color: #666;
      margin-bottom: 24px;
      background: #e3f2fd;
      padding: 12px 16px;
      border-radius: 8px;
      border-left: 4px solid #1565c0;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    
    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .stat-value {
      display: block;
      font-size: 1.8rem;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 4px;
    }
    
    .stat-label {
      font-size: 0.85rem;
      color: #666;
    }
    
    .table-container {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .orders-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .orders-table th,
    .orders-table td {
      padding: 16px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .orders-table th {
      background: #f8f9fa;
      font-weight: 600;
      color: #555;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .orders-table tbody tr:hover {
      background: #fafafa;
    }
    
    .orders-table tbody tr:last-child td {
      border-bottom: none;
    }
    
    .order-id {
      font-family: monospace;
      font-weight: 600;
      color: #333;
    }
    
    .total {
      font-weight: 600;
      color: #333;
    }
    
    .status {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 500;
    }
    
    .status.delivered { 
      background: #e8f5e9; 
      color: #2e7d32; 
    }
    
    .status.pending { 
      background: #fff3e0; 
      color: #ef6c00; 
    }
    
    .status.processing { 
      background: #e3f2fd; 
      color: #1565c0; 
    }
    
    .status.shipped {
      background: #f3e5f5;
      color: #7b1fa2;
    }
    
    .status.cancelled {
      background: #ffebee;
      color: #c62828;
    }
    
    .btn {
      display: inline-block;
      padding: 8px 16px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s;
      font-size: 0.85rem;
      background: #667eea;
      color: white;
    }
    
    .btn:hover {
      background: #5a6fd6;
      text-decoration: none;
    }
    
    .btn-small {
      padding: 6px 12px;
      font-size: 0.8rem;
    }
    
    .no-orders {
      text-align: center;
      padding: 48px;
      color: #666;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .table-container {
        overflow-x: auto;
      }
      
      .orders-table {
        min-width: 600px;
      }
    }
  `]
})
export class OrderListComponent implements OnInit {
  // Inject the shared MSAL service - same instance as the Shell!
  private msalService = inject(MsalService);
  
  currentUser: string | null = null;
  
  // Sample order data
  orders: Order[] = [
    { id: 1001, date: new Date('2024-01-15'), status: 'Delivered', total: 1549.98, items: 2, trackingNumber: 'TRK123456789' },
    { id: 1002, date: new Date('2024-01-18'), status: 'Processing', total: 899.99, items: 1 },
    { id: 1003, date: new Date('2024-01-20'), status: 'Pending', total: 249.99, items: 1 },
    { id: 1004, date: new Date('2024-01-22'), status: 'Shipped', total: 479.98, items: 2, trackingNumber: 'TRK987654321' },
    { id: 1005, date: new Date('2024-01-25'), status: 'Delivered', total: 129.99, items: 1, trackingNumber: 'TRK456789123' },
    { id: 1006, date: new Date('2024-01-28'), status: 'Cancelled', total: 59.99, items: 1 },
    { id: 1007, date: new Date('2024-02-01'), status: 'Processing', total: 799.99, items: 1 },
    { id: 1008, date: new Date('2024-02-05'), status: 'Delivered', total: 349.97, items: 3, trackingNumber: 'TRK789123456' },
  ];

  get totalSpent(): number {
    return this.orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, order) => sum + order.total, 0);
  }

  ngOnInit(): void {
    // Access the shared MSAL instance - auth state is federated from the Shell!
    try {
      const account = this.msalService.instance.getActiveAccount();
      if (account) {
        this.currentUser = account.name || account.username;
        console.log('Orders MFE - User authenticated:', this.currentUser);
        console.log('Orders MFE - Account details:', {
          name: account.name,
          username: account.username,
          tenantId: account.tenantId,
        });
        
        // Demonstrate token acquisition
        this.logTokenInfo();
      } else {
        console.log('Orders MFE - No active account found');
      }
    } catch (error) {
      console.error('Orders MFE - Error accessing MSAL:', error);
    }
  }

  /**
   * Demonstrate token acquisition in the MFE
   */
  private async logTokenInfo(): Promise<void> {
    try {
      const account = this.msalService.instance.getActiveAccount();
      if (account) {
        const response = await this.msalService.instance.acquireTokenSilent({
          scopes: ['User.Read'],
          account: account,
        });
        console.log('Orders MFE - Access Token acquired successfully');
        console.log('Orders MFE - Token preview:', response.accessToken.substring(0, 50) + '...');
      }
    } catch (error) {
      console.error('Orders MFE - Token acquisition failed:', error);
    }
  }

  getOrdersByStatus(status: Order['status']): Order[] {
    return this.orders.filter(o => o.status === status);
  }

  getStatusClass(status: Order['status']): string {
    return status.toLowerCase();
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
}
