#!/usr/bin/env python3
"""
Final CSS Optimization for Task 20
Removes all comments and minifies whitespace to get under 100KB
"""

import re

def final_optimize(input_file, output_file):
    """Final optimization: remove all comments and minify"""
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_size = len(content)
    print(f"Original: {original_size/1024:.2f} KB")
    
    # Minimal header
    header = """/**
 * Modern Admin Styler Enterprise (MASE) v2.0.0
 * GPL-2.0+ | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ | WCAG 2.1 AA
 */
"""
    
    # Find where CSS starts
    first_css = re.search(r'(:root\s*{)', content, re.MULTILINE)
    if first_css:
        content = content[first_css.start():]
    
    # Remove ALL comments
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    
    # Minify whitespace but keep readable
    # Remove blank lines
    content = re.sub(r'\n\s*\n', '\n', content)
    # Remove leading whitespace
    content = re.sub(r'^\s+', '', content, flags=re.MULTILINE)
    # Remove trailing whitespace  
    content = re.sub(r'\s+$', '', content, flags=re.MULTILINE)
    # Normalize spacing around braces
    content = re.sub(r'\s*{\s*', ' {\n', content)
    content = re.sub(r'\s*}\s*', '\n}\n', content)
    # Normalize spacing around colons and semicolons
    content = re.sub(r'\s*:\s*', ': ', content)
    content = re.sub(r'\s*;\s*', ';\n', content)
    # Remove extra blank lines
    content = re.sub(r'\n{3,}', '\n\n', content)
    
    # Combine
    final_content = header + '\n' + content.strip() + '\n'
    
    optimized_size = len(final_content)
    reduction = ((original_size - optimized_size) / original_size) * 100
    
    print(f"Optimized: {optimized_size/1024:.2f} KB")
    print(f"Reduction: {reduction:.1f}%")
    
    target_met = optimized_size < 102400
    print(f"Target met: {'✓ YES' if target_met else '✗ NO'}")
    
    if target_met:
        print(f"\n✓ SUCCESS! File is {102400 - optimized_size} bytes under target")
    else:
        print(f"\n✗ Still {optimized_size - 102400} bytes over target")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(final_content)
    
    return target_met

if __name__ == '__main__':
    success = final_optimize(
        'woow-admin/assets/css/mase-admin.css',
        'woow-admin/assets/css/mase-admin-optimized.css'
    )
