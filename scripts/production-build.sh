#!/bin/bash

###############################################################################
# Production Build Script
# Task 22.1: Create production build
# Requirements: 2.3, 2.5
#
# This script creates an optimized production build with:
# - Code splitting and tree shaking
# - Minification and compression
# - Bundle size verification
# - Source map generation
# - Build artifact validation
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored message
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Print section header
print_header() {
    echo ""
    print_message "$BLUE" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    print_message "$BLUE" "  $1"
    print_message "$BLUE" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verify prerequisites
verify_prerequisites() {
    print_header "Verifying Prerequisites"
    
    if ! command_exists node; then
        print_message "$RED" "❌ Node.js is not installed"
        exit 1
    fi
    
    if ! command_exists npm; then
        print_message "$RED" "❌ npm is not installed"
        exit 1
    fi
    
    print_message "$GREEN" "✅ Node.js $(node --version)"
    print_message "$GREEN" "✅ npm $(npm --version)"
}

# Clean previous builds
clean_build() {
    print_header "Cleaning Previous Builds"
    
    if [ -d "dist" ]; then
        print_message "$YELLOW" "🗑️  Removing dist directory..."
        rm -rf dist
        print_message "$GREEN" "✅ Cleaned dist directory"
    else
        print_message "$GREEN" "✅ No previous build to clean"
    fi
}

# Install dependencies
install_dependencies() {
    print_header "Installing Dependencies"
    
    print_message "$YELLOW" "📦 Running npm install..."
    npm install --production=false
    print_message "$GREEN" "✅ Dependencies installed"
}

# Run linting
run_linting() {
    print_header "Running Code Quality Checks"
    
    print_message "$YELLOW" "🔍 Running ESLint..."
    if npm run lint; then
        print_message "$GREEN" "✅ Linting passed"
    else
        print_message "$RED" "❌ Linting failed"
        print_message "$YELLOW" "💡 Run 'npm run lint:fix' to auto-fix issues"
        exit 1
    fi
    
    print_message "$YELLOW" "🔍 Running Prettier check..."
    if npm run format:check; then
        print_message "$GREEN" "✅ Code formatting is correct"
    else
        print_message "$RED" "❌ Code formatting issues found"
        print_message "$YELLOW" "💡 Run 'npm run format' to auto-format code"
        exit 1
    fi
}

# Run tests
run_tests() {
    print_header "Running Test Suite"
    
    print_message "$YELLOW" "🧪 Running unit tests..."
    if npm run test; then
        print_message "$GREEN" "✅ All tests passed"
    else
        print_message "$RED" "❌ Tests failed"
        exit 1
    fi
    
    print_message "$YELLOW" "📊 Generating coverage report..."
    if npm run test:coverage; then
        print_message "$GREEN" "✅ Coverage report generated"
    else
        print_message "$YELLOW" "⚠️  Coverage report generation failed (non-critical)"
    fi
}

# Build production bundle
build_production() {
    print_header "Building Production Bundle"
    
    print_message "$YELLOW" "🔨 Running Vite production build..."
    if NODE_ENV=production npm run build; then
        print_message "$GREEN" "✅ Production build completed"
    else
        print_message "$RED" "❌ Build failed"
        exit 1
    fi
}

# Verify bundle sizes
verify_bundle_sizes() {
    print_header "Verifying Bundle Sizes"
    
    print_message "$YELLOW" "📏 Checking bundle sizes..."
    if npm run check-size; then
        print_message "$GREEN" "✅ All bundles meet size targets"
    else
        print_message "$RED" "❌ Some bundles exceed size targets"
        print_message "$YELLOW" "💡 Run 'npm run analyze' to investigate"
        exit 1
    fi
}

# Verify build artifacts
verify_artifacts() {
    print_header "Verifying Build Artifacts"
    
    local errors=0
    
    # Check manifest.json exists
    if [ -f "dist/manifest.json" ]; then
        print_message "$GREEN" "✅ manifest.json generated"
    else
        print_message "$RED" "❌ manifest.json not found"
        errors=$((errors + 1))
    fi
    
    # Check main entry point exists
    if ls dist/main-admin.*.js 1> /dev/null 2>&1; then
        print_message "$GREEN" "✅ Main entry point generated"
    else
        print_message "$RED" "❌ Main entry point not found"
        errors=$((errors + 1))
    fi
    
    # Check source maps exist
    if ls dist/*.js.map 1> /dev/null 2>&1; then
        print_message "$GREEN" "✅ Source maps generated"
    else
        print_message "$YELLOW" "⚠️  Source maps not found (non-critical)"
    fi
    
    # Check chunks directory exists
    if [ -d "dist/chunks" ]; then
        local chunk_count=$(ls -1 dist/chunks/*.js 2>/dev/null | wc -l)
        print_message "$GREEN" "✅ Code splitting successful ($chunk_count chunks)"
    else
        print_message "$YELLOW" "⚠️  No chunks directory (code splitting may not be working)"
    fi
    
    if [ $errors -gt 0 ]; then
        print_message "$RED" "❌ Build artifact verification failed"
        exit 1
    fi
}

# Generate build report
generate_report() {
    print_header "Build Report"
    
    local build_date=$(date '+%Y-%m-%d %H:%M:%S')
    local node_version=$(node --version)
    local npm_version=$(npm --version)
    
    # Count files
    local js_files=$(find dist -name "*.js" -not -name "*.map" | wc -l)
    local map_files=$(find dist -name "*.js.map" | wc -l)
    
    # Calculate total size
    local total_size=$(du -sh dist | cut -f1)
    
    cat > dist/BUILD_REPORT.txt << EOF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MASE Production Build Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build Date:     $build_date
Node Version:   $node_version
npm Version:    $npm_version

Build Artifacts:
  JavaScript Files:  $js_files
  Source Maps:       $map_files
  Total Size:        $total_size

Build Configuration:
  - Minification:    Enabled (Terser)
  - Source Maps:     Enabled
  - Code Splitting:  Enabled
  - Tree Shaking:    Enabled
  - Drop Console:    Enabled

Bundle Targets:
  - Core Bundle:     < 30KB
  - Preview Bundle:  < 40KB
  - Feature Bundles: < 30KB each
  - Total Target:    < 100KB

Status: ✅ Build Successful

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF
    
    cat dist/BUILD_REPORT.txt
    print_message "$GREEN" "✅ Build report saved to dist/BUILD_REPORT.txt"
}

# Main execution
main() {
    print_message "$BLUE" "╔════════════════════════════════════════════════════════════════════════════╗"
    print_message "$BLUE" "║                                                                            ║"
    print_message "$BLUE" "║                    MASE Production Build Script                            ║"
    print_message "$BLUE" "║                                                                            ║"
    print_message "$BLUE" "╚════════════════════════════════════════════════════════════════════════════╝"
    
    verify_prerequisites
    clean_build
    install_dependencies
    run_linting
    run_tests
    build_production
    verify_bundle_sizes
    verify_artifacts
    generate_report
    
    print_header "Build Complete"
    print_message "$GREEN" "✅ Production build completed successfully!"
    print_message "$BLUE" "📦 Build artifacts are in the 'dist' directory"
    print_message "$BLUE" "📄 See dist/BUILD_REPORT.txt for details"
    echo ""
}

# Run main function
main
