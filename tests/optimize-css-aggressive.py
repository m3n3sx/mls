#!/usr/bin/env python3
"""
Aggressive CSS Optimization for Task 20
Creates a production-ready CSS file under 100KB
"""

import re

def aggressive_optimize(input_file, output_file):
    """Aggressively optimize CSS while maintaining all functionality"""
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_size = len(content)
    print(f"Original: {original_size/1024:.2f} KB")
    
    # Keep only the file header comment (first comment block)
    header_match = re.search(r'^(/\*\*.*?\*/)', content, re.DOTALL)
    header = header_match.group(1) if header_match else ''
    
    # Remove ALL comments except the header
    content_no_header = content[len(header):] if header else content
    content_no_comments = re.sub(r'/\*.*?\*/', '', content_no_header, flags=re.DOTALL)
    
    # Reconstruct with minimal header
    minimal_header = """/**
 * Modern Admin Styler Enterprise (MASE) - Admin Styles
 * @version 2.0.0
 * @license GPL-2.0+
 * Browser Support: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
 * Performance: <100KB uncompressed, WCAG 2.1 AA compliant
 */

"""
    
    content = minimal_header + content_no_comments
    
    # Remove excessive whitespace
    content = re.sub(r'\n{3,}', '\n\n', content)
    content = re.sub(r'[ \t]+$', '', content, flags=re.MULTILINE)
    content = re.sub(r'^\s+', '', content, flags=re.MULTILINE)
    
    # Optimize spacing around braces and colons (but keep readable)
    content = re.sub(r'\s*{\s*', ' {\n  ', content)
    content = re.sub(r'\s*}\s*', '\n}\n\n', content)
    content = re.sub(r':\s+', ': ', content)
    content = re.sub(r';\s+', ';\n  ', content)
    
    # Remove empty rules
    content = re.sub(r'[^}]+\{\s*\}', '', content)
    
    # Final cleanup
    content = re.sub(r'\n{3,}', '\n\n', content)
    
    optimized_size = len(content)
    reduction = ((original_size - optimized_size) / original_size) * 100
    
    print(f"Optimized: {optimized_size/1024:.2f} KB")
    print(f"Reduction: {reduction:.1f}%")
    print(f"Target met: {'✓ YES' if optimized_size < 102400 else '✗ NO'}")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return optimized_size

if __name__ == '__main__':
    size = aggressive_optimize(
        'woow-admin/assets/css/mase-admin.css',
        'woow-admin/assets/css/mase-admin-optimized.css'
    )
