#!/bin/bash

# Modern Admin Styler Enterprise - Unit Test Runner
# Task 24: JavaScript Unit Tests

echo "=========================================="
echo "MASE JavaScript Unit Tests"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js to run JavaScript unit tests"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed"
    echo "Please install npm to run JavaScript unit tests"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Navigate to plugin directory
cd "$(dirname "$0")/.." || exit 1

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Run tests
echo "🧪 Running unit tests..."
echo ""
npm test

# Check exit code
if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "✅ All tests passed!"
    echo "=========================================="
else
    echo ""
    echo "=========================================="
    echo "❌ Some tests failed"
    echo "=========================================="
    exit 1
fi
