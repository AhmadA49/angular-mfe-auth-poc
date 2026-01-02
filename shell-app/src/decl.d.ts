// Type declarations for remote modules loaded via Module Federation

declare module 'mfeProducts/routes' {
  export const PRODUCTS_ROUTES: import('@angular/router').Routes;
}

declare module 'mfeOrders/routes' {
  export const ORDERS_ROUTES: import('@angular/router').Routes;
}

declare module 'mfeProducts/ProductList' {
  export const ProductListComponent: import('@angular/core').Type<any>;
}

declare module 'mfeOrders/OrderList' {
  export const OrderListComponent: import('@angular/core').Type<any>;
}

// Module Federation runtime types
declare module '@angular-architects/module-federation' {
  export function loadRemoteModule(options: {
    type: 'manifest' | 'module' | 'script';
    remoteName?: string;
    remoteEntry?: string;
    exposedModule: string;
  }): Promise<any>;

  export function initFederation(manifestUrl: string): Promise<void>;
}
