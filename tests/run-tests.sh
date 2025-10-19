#!/bin/bash
# MASE Test Runner
# Runs all tests and generates a report

echo "======================================"
echo "  MASE Test Suite"
echo "======================================"
echo ""

# Check if WordPress is available
if [ ! -f "../../../wp-load.php" ]; then
    echo "❌ Error: WordPress not found. Please run from WordPress plugins directory."
    exit 1
fi

echo "Running Performance Tests..."
echo "------------------------------"
php performance-test.php
echo ""

echo "Running Integration Tests..."
echo "------------------------------"
php integration-test.php
echo ""

echo "======================================"
echo "  Test Suite Complete"
echo "======================================"
