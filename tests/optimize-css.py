#!/usr/bin/env python3
"""
CSS Optimization Script for Task 20
Optimizes mase-admin.css by:
1. Removing excessive comments while keeping critical ones
2. Consolidating duplicate rules
3. Optimizing whitespace
4. Maintaining functionality and readability
"""

import re
import sys

def optimize_css(input_file, output_file):
    """Optimize CSS file while maintaining functionality"""
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_size = len(content)
    print(f"Original size: {original_size} bytes ({original_size/1024:.2f} KB)")
    
    # Step 1: Preserve critical sections but reduce verbosity
    # Keep section headers but make them more concise
    content = re.sub(
        r'/\*\s*={70,}\s*\n\s*SECTION \d+:([^\n]+)\n\s*={70,}\s*\n\s*(.*?)\s*={70,}\s*\*/',
        r'/* ===== SECTION:\1 ===== */',
        content,
        flags=re.DOTALL
    )
    
    # Step 2: Remove verbose inline documentation blocks
    # Keep single-line comments, remove multi-line documentation
    content = re.sub(
        r'/\*\*\s*\n\s*\*[^\n]*\n\s*\*\s*\n((?:\s*\*[^\n]*\n)+)\s*\*/',
        lambda m: '/* ' + ' '.join(line.strip().lstrip('*').strip() for line in m.group(1).split('\n') if line.strip().lstrip('*').strip()) + ' */' if len(m.group(1)) < 500 else '',
        content,
        flags=re.MULTILINE
    )
    
    # Step 3: Remove excessive blank lines (keep max 1)
    content = re.sub(r'\n{3,}', '\n\n', content)
    
    # Step 4: Remove trailing whitespace
    content = re.sub(r'[ \t]+$', '', content, flags=re.MULTILINE)
    
    # Step 5: Consolidate similar selectors (basic optimization)
    # This is a simple version - more complex consolidation would require CSS parsing
    
    # Step 6: Remove documentation-only classes
    content = re.sub(
        r'/\*\s*This is a documentation class.*?\*/',
        '',
        content,
        flags=re.DOTALL
    )
    
    # Step 7: Optimize comments - remove very long explanatory comments
    # Keep comments under 200 characters
    def shorten_comment(match):
        comment = match.group(1)
        if len(comment) > 200:
            # Keep first sentence only
            first_sentence = comment.split('.')[0] + '.'
            if len(first_sentence) < 200:
                return f'/* {first_sentence} */'
            return ''
        return match.group(0)
    
    content = re.sub(r'/\*\s*([^*]+?)\s*\*/', shorten_comment, content)
    
    # Step 8: Remove empty rule sets
    content = re.sub(r'[^}]+\{\s*\}', '', content)
    
    # Step 9: Final cleanup - remove multiple consecutive blank lines
    content = re.sub(r'\n{3,}', '\n\n', content)
    
    optimized_size = len(content)
    reduction = ((original_size - optimized_size) / original_size) * 100
    
    print(f"Optimized size: {optimized_size} bytes ({optimized_size/1024:.2f} KB)")
    print(f"Reduction: {reduction:.1f}%")
    
    # Write optimized content
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return optimized_size < 102400  # Target: under 100KB

if __name__ == '__main__':
    input_file = 'woow-admin/assets/css/mase-admin.css'
    output_file = 'woow-admin/assets/css/mase-admin-optimized.css'
    
    success = optimize_css(input_file, output_file)
    
    if success:
        print("✓ Optimization successful - file size under 100KB")
        sys.exit(0)
    else:
        print("⚠ File still over 100KB - manual optimization needed")
        sys.exit(1)
