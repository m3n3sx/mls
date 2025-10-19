#!/usr/bin/env python3
"""Fix brace mismatch in optimized CSS"""

import re

with open('woow-admin/assets/css/mase-admin-optimized.css', 'r') as f:
    content = f.read()

# Count braces
open_count = content.count('{')
close_count = content.count('}')

print(f"Open braces: {open_count}")
print(f"Close braces: {close_count}")

if close_count > open_count:
    # Find standalone closing braces
    lines = content.split('\n')
    fixed_lines = []
    
    for line in lines:
        # Skip lines that are just a closing brace
        if line.strip() == '}' and fixed_lines and fixed_lines[-1].strip() == '}':
            print(f"Removing duplicate closing brace")
            continue
        fixed_lines.append(line)
    
    content = '\n'.join(fixed_lines)
    
    # Verify fix
    new_open = content.count('{')
    new_close = content.count('}')
    print(f"\nAfter fix:")
    print(f"Open braces: {new_open}")
    print(f"Close braces: {new_close}")
    
    if new_open == new_close:
        with open('woow-admin/assets/css/mase-admin-optimized.css', 'w') as f:
            f.write(content)
        print("✓ Fixed!")
    else:
        print("✗ Still mismatched")
