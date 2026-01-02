# Angular Micro Front-ends POC with Azure Entra ID Authentication

This POC demonstrates a Micro Front-ends architecture using Module Federation in Angular with Azure Entra ID (formerly Azure AD) authentication. The Shell application handles user authentication via MSAL, and JWT tokens are federated/shared across all remote micro front-ends.

## Architecture

```
angular-mfe-auth-poc/
├── shell-app/          # Host application (port 4200) - HANDLES AUTH
├── mfe-products/       # Remote: Products micro front-end (port 4201)
├── mfe-orders/         # Remote: Orders micro front-end (port 4202)
└── README.md
```

## Key Features

- ✅ Azure Entra ID Authentication (MSAL Angular v3)
- ✅ JWT Token Federation across all MFEs
- ✅ Protected Routes with MsalGuard
- ✅ HTTP Interceptor for automatic token attachment
- ✅ Module Federation (Webpack 5)
- ✅ Angular 18 Standalone Components
- ✅ Reactive state management with Signals

## Prerequisites

- Node.js 18+ and npm 9+
- Angular CLI 18+
- Azure Entra ID tenant with registered application

## Azure Entra ID Setup

### 1. Register Application in Azure Portal

1. Go to [Azure Portal](https://portal.azure.com) → **Microsoft Entra ID** → **App registrations**
2. Click **New registration**
3. Configure:
   - **Name**: `Angular MFE POC`
   - **Supported account types**: Single tenant or Multi-tenant
   - **Redirect URI**: 
     - Platform: **Single-page application (SPA)**
     - URI: `http://localhost:4200`

4. Click **Register**
5. Note down:
   - **Application (client) ID**: `<YOUR_CLIENT_ID>`
   - **Directory (tenant) ID**: `<YOUR_TENANT_ID>`

### 2. Configure Authentication Settings

1. Go to **Authentication** blade
2. Add Redirect URIs:
   ```
   http://localhost:4200
   http://localhost:4201
   http://localhost:4202
   ```
3. Under **Implicit grant and hybrid flows**: Leave UNCHECKED
4. Under **Advanced settings**: Allow public client flows: No

### 3. Configure API Permissions

1. Go to **API permissions** blade
2. Add: Microsoft Graph → User.Read

## Installation

### Step 1: Create Angular Applications

```bash
# Navigate to workspace
cd angular-mfe-auth-poc

# Create Shell Application
ng new shell-app --routing --style=scss --standalone --skip-git
cd shell-app
npm install @azure/msal-browser@3.x @azure/msal-angular@3.x
ng add @angular-architects/module-federation --port 4200 --type dynamic-host
cd ..

# Create Products MFE
ng new mfe-products --routing --style=scss --standalone --skip-git
cd mfe-products
npm install @azure/msal-browser@3.x @azure/msal-angular@3.x
ng add @angular-architects/module-federation --port 4201 --type remote
cd ..

# Create Orders MFE
ng new mfe-orders --routing --style=scss --standalone --skip-git
cd mfe-orders
npm install @azure/msal-browser@3.x @azure/msal-angular@3.x
ng add @angular-architects/module-federation --port 4202 --type remote
cd ..
```

### Step 2: Copy Source Files

Copy the source files from this POC into each application:

- Copy `shell-app/src/` contents to your shell-app
- Copy `mfe-products/src/` contents to your mfe-products
- Copy `mfe-orders/src/` contents to your mfe-orders

### Step 3: Update Azure Configuration

Edit `shell-app/src/app/auth/auth-config.ts` and update:

```typescript
const TENANT_ID = 'YOUR_ACTUAL_TENANT_ID';
const CLIENT_ID = 'YOUR_ACTUAL_CLIENT_ID';
```

### Step 4: Update Webpack Configurations

Replace the webpack.config.js files in each application with the ones provided.

## Running the POC

Open three terminal windows:

```bash
# Terminal 1 - Products MFE
cd mfe-products
ng serve --port 4201

# Terminal 2 - Orders MFE  
cd mfe-orders
ng serve --port 4202

# Terminal 3 - Shell (start last)
cd shell-app
ng serve --port 4200
```

Navigate to `http://localhost:4200`

## Testing Authentication Flow

1. Open `http://localhost:4200`
2. Click "Sign In with Microsoft"
3. Authenticate with your Azure Entra ID credentials
4. After redirect, you should be logged in
5. Navigate to "Products" - MFE loads and shows your username
6. Navigate to "Orders" - MFE loads and shows your username
7. Click "Profile" to see token information

## Verify JWT Federation

Open browser DevTools (F12) → Console tab. You should see:
```
Products MFE - User authenticated: John Doe
Products MFE - Access Token acquired: eyJ0eXAiOiJKV1QiLCJhbGc...
Orders MFE - User authenticated: John Doe
```

## Project Structure

### Shell Application
- Handles all authentication via MSAL
- Loads remote MFEs dynamically
- Protects routes with MsalGuard
- Provides HTTP interceptor for API calls

### Remote MFEs (Products/Orders)
- Consume shared MSAL instance
- Access authenticated user context
- Can acquire tokens silently for API calls

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "MSAL instance not initialized" | Ensure shell bootstraps before MFEs load |
| "No account found" | User not logged in or token expired |
| MFE can't access auth state | Check MSAL is in `shared` config in webpack |
| "Interaction in progress" | Wait for redirect to complete |
| Token not attached to requests | Check protectedResourceMap configuration |
| CORS errors | Configure Azure AD with correct redirect URIs |

## Security Best Practices

- ✅ Use Authorization Code Flow with PKCE (MSAL default)
- ✅ Store tokens in LocalStorage for SSO across tabs
- ✅ Use singleton MSAL instance for Module Federation
- ✅ Implement proper logout
- ❌ Don't store tokens in sessionStorage for MFE architectures
- ❌ Don't initialize MSAL separately in each MFE
- ❌ Don't hardcode secrets - use environment variables
- ❌ Don't skip HTTPS in production

## Resources

- [MSAL Angular Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-angular)
- [Microsoft Identity Platform](https://learn.microsoft.com/en-us/entra/identity-platform/)
- [Angular Architects Module Federation](https://www.npmjs.com/package/@angular-architects/module-federation)
