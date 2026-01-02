const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

const mfConfig = withModuleFederationPlugin({
  name: 'mfeOrders',

  // Expose modules for the shell to consume
  exposes: {
    './routes': './src/app/app.routes.ts',
    './OrderList': './src/app/orders/order-list/order-list.component.ts',
  },

  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: false,
      requiredVersion: 'auto'
    }),

    // CRITICAL: Share MSAL to receive auth state from shell
    '@azure/msal-browser': {
      singleton: true,
      strictVersion: false,
      requiredVersion: '^3.0.0',
      eager: false,
    },
    '@azure/msal-angular': {
      singleton: true,
      strictVersion: false,
      requiredVersion: '^3.0.0',
      eager: false,
    },
  },
});

// Fix for import.meta error in styles and set correct publicPath for chunks
mfConfig.output = {
  ...mfConfig.output,
  scriptType: 'text/javascript',
  publicPath: 'https://localhost:4202/',
};

module.exports = mfConfig;
