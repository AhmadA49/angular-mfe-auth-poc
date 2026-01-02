const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'mfeOrders',

  exposes: {
    './routes': './src/app/app.routes.ts',
    './OrderList': './src/app/orders/order-list/order-list.component.ts',
  },

  shared: {
    ...shareAll({ 
      singleton: true, 
      strictVersion: true, 
      requiredVersion: 'auto' 
    }),
    '@azure/msal-browser': {
      singleton: true,
      strictVersion: false,
      requiredVersion: 'auto',
    },
    '@azure/msal-angular': {
      singleton: true,
      strictVersion: false,
      requiredVersion: 'auto',
    },
  },
});
