// Development environment configuration

export const environment = {
  production: false,
  azure: {
    clientId: 'YOUR_DEV_CLIENT_ID',
    tenantId: 'YOUR_TENANT_ID',
    redirectUri: 'http://localhost:4200',
  },
  manifestUrl: '/assets/mf.manifest.json',
};
