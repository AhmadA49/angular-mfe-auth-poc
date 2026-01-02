const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

const mfConfig = withModuleFederationPlugin({
  // Dynamic remotes loaded from manifest
  remotes: {},

  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: false,
      requiredVersion: 'auto'
    }),

    // CRITICAL: Share MSAL as singleton to federate auth state across all MFEs
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

// Fix for import.meta error in styles
mfConfig.output = {
  ...mfConfig.output,
  scriptType: 'text/javascript',
};

module.exports = mfConfig;
