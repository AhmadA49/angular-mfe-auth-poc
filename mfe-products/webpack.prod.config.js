const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'mfeProducts',

  exposes: {
    './routes': './src/app/app.routes.ts',
    './ProductList': './src/app/products/product-list/product-list.component.ts',
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
