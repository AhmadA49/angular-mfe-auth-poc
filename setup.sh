#!/bin/bash

# Angular MFE Auth POC - Setup Script
# This script helps set up the POC from scratch

echo "🚀 Angular Micro Front-ends with Azure Entra ID Authentication POC"
echo "=================================================================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "✅ Node.js: $NODE_VERSION"
else
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "✅ npm: $NPM_VERSION"
else
    echo "❌ npm not found"
    exit 1
fi

# Check Angular CLI
if command -v ng &> /dev/null; then
    NG_VERSION=$(ng version 2>/dev/null | grep "Angular CLI" | awk '{print $3}')
    echo "✅ Angular CLI: $NG_VERSION"
else
    echo "⚠️  Angular CLI not found. Installing globally..."
    npm install -g @angular/cli@18
fi

echo ""
echo "📦 Installing dependencies for all applications..."
echo ""

# Install dependencies for Shell
echo "Installing Shell App dependencies..."
cd shell-app
npm install
cd ..

# Install dependencies for Products MFE
echo "Installing Products MFE dependencies..."
cd mfe-products
npm install
cd ..

# Install dependencies for Orders MFE
echo "Installing Orders MFE dependencies..."
cd mfe-orders
npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 IMPORTANT: Before running, update Azure AD configuration:"
echo "   Edit: shell-app/src/app/auth/auth-config.ts"
echo "   Replace: YOUR_TENANT_ID and YOUR_CLIENT_ID"
echo ""
echo "🚀 To start all applications, run:"
echo "   Terminal 1: cd mfe-products && npm start"
echo "   Terminal 2: cd mfe-orders && npm start"
echo "   Terminal 3: cd shell-app && npm start"
echo ""
echo "🌐 Then open: http://localhost:4200"
