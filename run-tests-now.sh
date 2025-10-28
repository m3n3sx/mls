#!/bin/bash
echo "Starting tests..."
node tests/visual-interactive/runner.cjs --mode headless --tab admin-bar > test-results.log 2>&1
echo "Exit code: $?" >> test-results.log
echo "Tests completed. Check test-results.log"
