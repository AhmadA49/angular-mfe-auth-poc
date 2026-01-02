const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  remotes: {},

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
