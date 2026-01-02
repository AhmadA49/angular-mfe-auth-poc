import { Routes } from '@angular/router';
import { OrderListComponent } from './orders/order-list/order-list.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';

/**
 * Orders MFE Routes
 * 
 * These routes are exposed to the Shell via Module Federation.
 * The Shell loads them with: loadRemoteModule({ exposedModule: './routes' })
 */
export const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: OrderListComponent },
  { path: 'detail/:id', component: OrderDetailComponent },
];

// Export for Module Federation - this is what the Shell imports
export const ORDERS_ROUTES = routes;
