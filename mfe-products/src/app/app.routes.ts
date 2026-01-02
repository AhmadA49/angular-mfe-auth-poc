import { Routes } from '@angular/router';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';

/**
 * Products MFE Routes
 * 
 * These routes are exposed to the Shell via Module Federation.
 * The Shell loads them with: loadRemoteModule({ exposedModule: './routes' })
 */
export const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: ProductListComponent },
  { path: 'detail/:id', component: ProductDetailComponent },
];

// Export for Module Federation - this is what the Shell imports
export const PRODUCTS_ROUTES = routes;
