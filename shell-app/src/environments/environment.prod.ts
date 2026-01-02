// Production environment configuration

export const environment = {
  production: true,
  azure: {
    clientId: 'YOUR_PROD_CLIENT_ID',
    tenantId: 'YOUR_TENANT_ID',
    redirectUri: 'https://your-app.example.com',
  },
  manifestUrl: 'https://cdn.example.com/mf.manifest.json',
};
