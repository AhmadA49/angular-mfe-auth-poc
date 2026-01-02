import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { loadRemoteModule } from '@angular-architects/module-federation';

import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginFailedComponent } from './login-failed/login-failed.component';
import { NotFoundComponent } from './not-found/not-found.component';

/**
 * Application routes configuration
 * 
 * Protected routes use MsalGuard to ensure authentication.
 * MFEs are loaded dynamically using Module Federation.
 */
export const routes: Routes = [
  // Default redirect to home
  { 
    path: '', 
    redirectTo: 'home', 
    pathMatch: 'full' 
  },
  
  // Public route - Home page
  { 
    path: 'home', 
    component: HomeComponent 
  },
  
  // Public route - Login failed page
  { 
    path: 'login-failed', 
    component: LoginFailedComponent 
  },
  
  // Protected route - User Profile
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [MsalGuard],
  },
  
  // Protected MFE - Products (requires authentication)
  // Dynamically loads the Products micro front-end from remote server
  {
    path: 'products',
    canActivate: [MsalGuard],
    loadChildren: () =>
      loadRemoteModule({
        type: 'manifest',
        remoteName: 'mfeProducts',
        exposedModule: './routes',
      })
        .then((m) => m.PRODUCTS_ROUTES)
        .catch((err) => {
          console.error('Error loading Products MFE:', err);
          // Return empty routes on error - could redirect to error page
          return [];
        }),
  },

  // Protected MFE - Orders (requires authentication)
  // Dynamically loads the Orders micro front-end from remote server
  {
    path: 'orders',
    canActivate: [MsalGuard],
    loadChildren: () =>
      loadRemoteModule({
        type: 'manifest',
        remoteName: 'mfeOrders',
        exposedModule: './routes',
      })
        .then((m) => m.ORDERS_ROUTES)
        .catch((err) => {
          console.error('Error loading Orders MFE:', err);
          return [];
        }),
  },

  // Catch-all route for 404
  { path: '**', component: NotFoundComponent },
];
