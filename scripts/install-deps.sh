
#!/bin/bash
# Script to install dependencies without modifying package.json directly

# Install puppeteer
echo "Installing puppeteer..."
npm install --no-save puppeteer@21.9.0

# Install pkg
echo "Installing pkg..."
npm install --no-save pkg@5.8.1

# Install eslint
echo "Installing eslint..."
npm install --no-save eslint@9.3.0

echo "Dependencies installed successfully!"
