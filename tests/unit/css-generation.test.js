/**
 * CSS Generation Test Suite
 * 
 * Tests for legacy CSS generation logic in mase-admin.js
 * These tests capture expected CSS output for regression testing
 * during migration to modern Preview Engine module.
 * 
 * Requirements: 3.1, 3.2, 11.1, 11.4
 * 
 * @package MASE
 * @since 1.2.0
 */

import { describe, it, expect, beforeEach } from 'vitest';

/**
 * Mock CSS Generation Functions
 * These replicate the logic from assets/js/mase-admin.js
 */

/**
 * Calculate shadow CSS value from visual effects settings
 * Replicates: MASE.livePreview.calculateShadow()
 */
function calculateShadow(effects) {
    const intensity = effects.shadow_intensity || 'none';
    const direction = effects.shadow_direction || 'bottom';
    const blur = parseInt(effects.shadow_blur) || 10;
    const color = effects.shadow_color || 'rgba(0,0,0,0.15)';
    
    if (intensity === 'none') {
        return 'none';
    }
    
    // Base shadow sizes by intensity
    const sizes = {
        'subtle': { x: 2, y: 2, spread: 0 },
        'medium': { x: 4, y: 4, spread: 0 },
        'strong': { x: 8, y: 8, spread: 2 }
    };
    
    // Direction modifiers
    const directions = {
        'top': { x: 0, y: -1 },
        'right': { x: 1, y: 0 },
        'bottom': { x: 0, y: 1 },
        'left': { x: -1, y: 0 },
        'center': { x: 0, y: 0 }
    };
    
    const base = sizes[intensity] || sizes.subtle;
    const dir = directions[direction] || directions.bottom;
    
    const x = base.x * dir.x;
    const y = base.y * dir.y;
    const spread = base.spread;
    
    return `${x}px ${y}px ${blur}px ${spread}px ${color}`;
}

/**
 * Generate element visual effects CSS
 * Replicates: MASE.livePreview.generateElementVisualEffects()
 */
function generateElementVisualEffects(selector, effects) {
    let css = '';
    
    css += `${selector}{`;
    
    // Border radius
    if (effects.border_radius) {
        css += `border-radius:${effects.border_radius}px!important;`;
    }
    
    // Box shadow
    const shadow = calculateShadow(effects);
    if (shadow !== 'none') {
        css += `box-shadow:${shadow}!important;`;
    }
    
    css += '}';
    
    return css;
}

/**
 * Generate admin bar CSS
 * Replicates: MASE.livePreview.generateAdminBarCSS()
 */
function generateAdminBarCSS(settings) {
    let css = '';
    const adminBar = settings.admin_bar || {};
    const visualEffects = settings.visual_effects || {};
    const adminBarEffects = visualEffects.admin_bar || {};
    
    // Get admin bar height (default 32px)
    const height = adminBar.height || 32;
    
    // Base positioning (always applied)
    css += 'body.wp-admin #wpadminbar{';
    css += 'position:fixed!important;';
    css += 'top:0!important;';
    css += 'left:0!important;';
    css += 'right:0!important;';
    css += 'z-index:99999!important;';
    
    if (adminBar.bg_color) {
        css += `background-color:${adminBar.bg_color}!important;`;
    }
    if (adminBar.height) {
        css += `height:${adminBar.height}px!important;`;
    }
    css += '}';
    
    // Adjust body padding to match admin bar height
    css += 'html.wp-toolbar{';
    css += `padding-top:${height}px!important;`;
    css += '}';
    
    // Admin bar text color
    if (adminBar.text_color) {
        css += 'body.wp-admin #wpadminbar .ab-item,';
        css += 'body.wp-admin #wpadminbar a.ab-item,';
        css += 'body.wp-admin #wpadminbar > #wp-toolbar span.ab-label,';
        css += 'body.wp-admin #wpadminbar > #wp-toolbar span.noticon{';
        css += `color:${adminBar.text_color}!important;`;
        css += '}';
    }
    
    // Glassmorphism effect (if enabled)
    if (adminBarEffects.glassmorphism) {
        const blur = adminBarEffects.blur_intensity || 20;
        css += 'body.wp-admin #wpadminbar{';
        css += `backdrop-filter:blur(${blur}px)!important;`;
        css += `-webkit-backdrop-filter:blur(${blur}px)!important;`;
        css += 'background-color:rgba(35,40,45,0.8)!important;';
        css += '}';
    } else {
        // Explicitly disable glassmorphism when turned off
        css += 'body.wp-admin #wpadminbar{';
        css += 'backdrop-filter:none!important;';
        css += '-webkit-backdrop-filter:none!important;';
        css += '}';
    }
    
    // Floating effect (if enabled)
    if (adminBarEffects.floating) {
        const margin = adminBarEffects.floating_margin || 8;
        const radius = adminBarEffects.border_radius || 8;
        
        css += 'body.wp-admin #wpadminbar{';
        css += `top:${margin}px!important;`;
        css += `left:${margin}px!important;`;
        css += `right:${margin}px!important;`;
        css += `width:calc(100% - ${margin * 2}px)!important;`;
        css += `border-radius:${radius}px!important;`;
        css += '}';
        
        // Adjust body padding for floating bar
        css += 'html.wp-toolbar{';
        css += `padding-top:${height + margin * 2}px!important;`;
        css += '}';
    } else {
        // Explicitly disable floating when turned off
        css += 'body.wp-admin #wpadminbar{';
        css += 'top:0!important;';
        css += 'left:0!important;';
        css += 'right:0!important;';
        css += 'width:100%!important;';
        css += 'border-radius:0!important;';
        css += '}';
    }
    
    // Submenu positioning
    if (adminBar.height) {
        css += 'body.wp-admin #wpadminbar .ab-sub-wrapper{';
        css += `top:${adminBar.height}px!important;`;
        css += '}';
    }
    
    return css;
}

/**
 * Generate admin menu CSS
 * Replicates: MASE.livePreview.generateAdminMenuCSS()
 */
function generateAdminMenuCSS(settings) {
    let css = '';
    const adminMenu = settings.admin_menu || {};
    
    // Admin menu background (always apply)
    css += 'body.wp-admin #adminmenu,';
    css += 'body.wp-admin #adminmenuback,';
    css += 'body.wp-admin #adminmenuwrap{';
    if (adminMenu.bg_color) {
        css += `background-color:${adminMenu.bg_color}!important;`;
    }
    css += '}';
    
    // Only set width if different from WordPress default (160px)
    const width = parseInt(adminMenu.width) || 160;
    if (width !== 160) {
        // Expanded menu width
        css += 'body.wp-admin:not(.folded) #adminmenu,';
        css += 'body.wp-admin:not(.folded) #adminmenuback,';
        css += 'body.wp-admin:not(.folded) #adminmenuwrap{';
        css += `width:${width}px!important;`;
        css += '}';
        
        // Folded menu width (always 36px when collapsed)
        css += 'body.wp-admin.folded #adminmenu,';
        css += 'body.wp-admin.folded #adminmenuback,';
        css += 'body.wp-admin.folded #adminmenuwrap{';
        css += 'width:36px!important;';
        css += '}';
        
        // Adjust content area margin for custom menu width (expanded)
        css += 'body.wp-admin:not(.folded) #wpcontent,';
        css += 'body.wp-admin:not(.folded) #wpfooter{';
        css += `margin-left:${width}px!important;`;
        css += '}';
        
        // Adjust content area margin for folded menu
        css += 'body.wp-admin.folded #wpcontent,';
        css += 'body.wp-admin.folded #wpfooter{';
        css += 'margin-left:36px!important;';
        css += '}';
    }
    
    // Admin menu height mode
    const heightMode = adminMenu.height_mode || 'full';
    if (heightMode === 'content') {
        css += 'body.wp-admin #adminmenuwrap,';
        css += 'body.wp-admin #adminmenuback,';
        css += 'body.wp-admin #adminmenumain{';
        css += 'height:auto!important;';
        css += 'min-height:0!important;';
        css += 'bottom:auto!important;';
        css += '}';
        
        css += 'body.wp-admin #adminmenu{';
        css += 'height:auto!important;';
        css += 'min-height:0!important;';
        css += 'position:relative!important;';
        css += 'bottom:auto!important;';
        css += '}';
        
        css += 'body.wp-admin #adminmenu li.menu-top{';
        css += 'height:auto!important;';
        css += '}';
    }
    
    // Admin menu text color
    if (adminMenu.text_color) {
        css += 'body.wp-admin #adminmenu a,';
        css += 'body.wp-admin #adminmenu div.wp-menu-name{';
        css += `color:${adminMenu.text_color}!important;`;
        css += '}';
    }
    
    // Admin menu hover states
    if (adminMenu.hover_bg_color) {
        css += 'body.wp-admin #adminmenu li.menu-top:hover,';
        css += 'body.wp-admin #adminmenu li.opensub > a.menu-top,';
        css += 'body.wp-admin #adminmenu li > a.menu-top:focus{';
        css += `background-color:${adminMenu.hover_bg_color}!important;`;
        css += '}';
    }
    
    if (adminMenu.hover_text_color) {
        css += 'body.wp-admin #adminmenu li.menu-top:hover a,';
        css += 'body.wp-admin #adminmenu li.opensub > a.menu-top,';
        css += 'body.wp-admin #adminmenu li > a.menu-top:focus{';
        css += `color:${adminMenu.hover_text_color}!important;`;
        css += '}';
    }
    
    return css;
}

/**
 * Generate typography CSS
 * Replicates: MASE.livePreview.generateTypographyCSS()
 */
function generateTypographyCSS(settings) {
    let css = '';
    const typography = settings.typography || {};
    
    // Admin bar typography
    if (typography.admin_bar) {
        const adminBar = typography.admin_bar;
        css += 'body.wp-admin #wpadminbar,';
        css += 'body.wp-admin #wpadminbar .ab-item,';
        css += 'body.wp-admin #wpadminbar > #wp-toolbar span.ab-label,';
        css += 'body.wp-admin #wpadminbar > #wp-toolbar span.noticon{';
        
        if (adminBar.font_size) {
            css += `font-size:${adminBar.font_size}px!important;`;
        }
        if (adminBar.font_weight) {
            css += `font-weight:${adminBar.font_weight}!important;`;
        }
        if (adminBar.line_height) {
            css += `line-height:${adminBar.line_height}!important;`;
        }
        if (adminBar.letter_spacing) {
            css += `letter-spacing:${adminBar.letter_spacing}px!important;`;
        }
        if (adminBar.text_transform) {
            css += `text-transform:${adminBar.text_transform}!important;`;
        }
        
        css += '}';
    }
    
    // Admin menu typography
    if (typography.admin_menu) {
        const adminMenu = typography.admin_menu;
        css += 'body.wp-admin #adminmenu a,';
        css += 'body.wp-admin #adminmenu div.wp-menu-name,';
        css += 'body.wp-admin #adminmenu .wp-submenu a{';
        
        if (adminMenu.font_size) {
            css += `font-size:${adminMenu.font_size}px!important;`;
        }
        if (adminMenu.font_weight) {
            css += `font-weight:${adminMenu.font_weight}!important;`;
        }
        if (adminMenu.line_height) {
            css += `line-height:${adminMenu.line_height}!important;`;
        }
        if (adminMenu.letter_spacing) {
            css += `letter-spacing:${adminMenu.letter_spacing}px!important;`;
        }
        if (adminMenu.text_transform) {
            css += `text-transform:${adminMenu.text_transform}!important;`;
        }
        
        css += '}';
    }
    
    // Content typography
    if (typography.content) {
        const content = typography.content;
        css += 'body.wp-admin #wpbody-content,';
        css += 'body.wp-admin .wrap,';
        css += 'body.wp-admin #wpbody-content p,';
        css += 'body.wp-admin .wrap p{';
        
        if (content.font_size) {
            css += `font-size:${content.font_size}px!important;`;
        }
        if (content.font_weight) {
            css += `font-weight:${content.font_weight}!important;`;
        }
        if (content.line_height) {
            css += `line-height:${content.line_height}!important;`;
        }
        if (content.letter_spacing !== undefined) {
            css += `letter-spacing:${content.letter_spacing}px!important;`;
        }
        if (content.text_transform) {
            css += `text-transform:${content.text_transform}!important;`;
        }
        
        css += '}';
    }
    
    return css;
}

/**
 * Generate visual effects CSS
 * Replicates: MASE.livePreview.generateVisualEffectsCSS()
 */
function generateVisualEffectsCSS(settings) {
    let css = '';
    const visualEffects = settings.visual_effects || {};
    
    // Admin bar visual effects
    if (visualEffects.admin_bar) {
        css += generateElementVisualEffects(
            'body.wp-admin #wpadminbar',
            visualEffects.admin_bar
        );
    }
    
    // Admin menu visual effects
    if (visualEffects.admin_menu) {
        css += generateElementVisualEffects(
            'body.wp-admin #adminmenu a',
            visualEffects.admin_menu
        );
    }
    
    return css;
}

/**
 * Main CSS generator
 * Replicates: MASE.livePreview.generateCSS()
 */
function generateCSS(settings) {
    let css = '';
    css += generateAdminBarCSS(settings);
    css += generateAdminMenuCSS(settings);
    css += generateTypographyCSS(settings);
    css += generateVisualEffectsCSS(settings);
    return css;
}

// ============================================================================
// TEST SUITES
// ============================================================================

describe('CSS Generation - Shadow Calculator', () => {
    it('should return "none" for no shadow', () => {
        const effects = { shadow_intensity: 'none' };
        expect(calculateShadow(effects)).toBe('none');
    });
    
    it('should calculate subtle bottom shadow', () => {
        const effects = {
            shadow_intensity: 'subtle',
            shadow_direction: 'bottom',
            shadow_blur: 10,
            shadow_color: 'rgba(0,0,0,0.15)'
        };
        expect(calculateShadow(effects)).toBe('0px 2px 10px 0px rgba(0,0,0,0.15)');
    });
    
    it('should calculate medium right shadow', () => {
        const effects = {
            shadow_intensity: 'medium',
            shadow_direction: 'right',
            shadow_blur: 10,
            shadow_color: 'rgba(0,0,0,0.15)'
        };
        expect(calculateShadow(effects)).toBe('4px 0px 10px 0px rgba(0,0,0,0.15)');
    });
    
    it('should calculate strong top shadow', () => {
        const effects = {
            shadow_intensity: 'strong',
            shadow_direction: 'top',
            shadow_blur: 10,
            shadow_color: 'rgba(0,0,0,0.15)'
        };
        expect(calculateShadow(effects)).toBe('0px -8px 10px 2px rgba(0,0,0,0.15)');
    });
    
    it('should use default values when not provided', () => {
        const effects = { shadow_intensity: 'subtle' };
        expect(calculateShadow(effects)).toBe('0px 2px 10px 0px rgba(0,0,0,0.15)');
    });
});

describe('CSS Generation - Admin Bar', () => {
    it('should generate default admin bar CSS', () => {
        const settings = {
            admin_bar: {
                bg_color: '#23282d',
                text_color: '#ffffff',
                height: 32
            },
            visual_effects: { admin_bar: {} }
        };
        
        const css = generateAdminBarCSS(settings);
        
        expect(css).toContain('body.wp-admin #wpadminbar{');
        expect(css).toContain('position:fixed!important;');
        expect(css).toContain('background-color:#23282d!important;');
        expect(css).toContain('height:32px!important;');
        expect(css).toContain('html.wp-toolbar{padding-top:32px!important;}');
    });
    
    it('should generate glassmorphism effect CSS', () => {
        const settings = {
            admin_bar: { height: 32 },
            visual_effects: {
                admin_bar: {
                    glassmorphism: true,
                    blur_intensity: 20
                }
            }
        };
        
        const css = generateAdminBarCSS(settings);
        
        expect(css).toContain('backdrop-filter:blur(20px)!important;');
        expect(css).toContain('-webkit-backdrop-filter:blur(20px)!important;');
        expect(css).toContain('background-color:rgba(35,40,45,0.8)!important;');
    });
    
    it('should generate floating admin bar CSS', () => {
        const settings = {
            admin_bar: { height: 32 },
            visual_effects: {
                admin_bar: {
                    floating: true,
                    floating_margin: 8,
                    border_radius: 8
                }
            }
        };
        
        const css = generateAdminBarCSS(settings);
        
        expect(css).toContain('top:8px!important;');
        expect(css).toContain('left:8px!important;');
        expect(css).toContain('right:8px!important;');
        expect(css).toContain('width:calc(100% - 16px)!important;');
        expect(css).toContain('border-radius:8px!important;');
        expect(css).toContain('html.wp-toolbar{padding-top:48px!important;}');
    });
    
    it('should disable glassmorphism when turned off', () => {
        const settings = {
            admin_bar: { height: 32 },
            visual_effects: {
                admin_bar: { glassmorphism: false }
            }
        };
        
        const css = generateAdminBarCSS(settings);
        
        expect(css).toContain('backdrop-filter:none!important;');
        expect(css).toContain('-webkit-backdrop-filter:none!important;');
    });
});

describe('CSS Generation - Admin Menu', () => {
    it('should generate default admin menu CSS', () => {
        const settings = {
            admin_menu: {
                bg_color: '#23282d',
                text_color: '#ffffff',
                width: 160
            }
        };
        
        const css = generateAdminMenuCSS(settings);
        
        expect(css).toContain('body.wp-admin #adminmenu');
        expect(css).toContain('background-color:#23282d!important;');
        // Width 160 is default, should not generate width CSS
        expect(css).not.toContain('width:160px!important;');
    });
    
    it('should generate custom width CSS', () => {
        const settings = {
            admin_menu: {
                bg_color: '#23282d',
                width: 200
            }
        };
        
        const css = generateAdminMenuCSS(settings);
        
        expect(css).toContain('width:200px!important;');
        expect(css).toContain('margin-left:200px!important;');
        expect(css).toContain('body.wp-admin.folded #adminmenu');
        expect(css).toContain('width:36px!important;');
    });
    
    it('should generate content height mode CSS', () => {
        const settings = {
            admin_menu: {
                height_mode: 'content'
            }
        };
        
        const css = generateAdminMenuCSS(settings);
        
        expect(css).toContain('height:auto!important;');
        expect(css).toContain('min-height:0!important;');
        expect(css).toContain('bottom:auto!important;');
    });
    
    it('should generate hover state CSS', () => {
        const settings = {
            admin_menu: {
                hover_bg_color: '#191e23',
                hover_text_color: '#00b9eb'
            }
        };
        
        const css = generateAdminMenuCSS(settings);
        
        expect(css).toContain('background-color:#191e23!important;');
        expect(css).toContain('color:#00b9eb!important;');
    });
});

describe('CSS Generation - Typography', () => {
    it('should generate admin bar typography CSS', () => {
        const settings = {
            typography: {
                admin_bar: {
                    font_size: 14,
                    font_weight: 600,
                    line_height: 1.6,
                    letter_spacing: 0.5,
                    text_transform: 'uppercase'
                }
            }
        };
        
        const css = generateTypographyCSS(settings);
        
        expect(css).toContain('font-size:14px!important;');
        expect(css).toContain('font-weight:600!important;');
        expect(css).toContain('line-height:1.6!important;');
        expect(css).toContain('letter-spacing:0.5px!important;');
        expect(css).toContain('text-transform:uppercase!important;');
    });
    
    it('should generate admin menu typography CSS', () => {
        const settings = {
            typography: {
                admin_menu: {
                    font_size: 13,
                    font_weight: 400
                }
            }
        };
        
        const css = generateTypographyCSS(settings);
        
        expect(css).toContain('body.wp-admin #adminmenu a');
        expect(css).toContain('font-size:13px!important;');
        expect(css).toContain('font-weight:400!important;');
    });
    
    it('should generate content typography CSS', () => {
        const settings = {
            typography: {
                content: {
                    font_size: 14,
                    line_height: 1.5
                }
            }
        };
        
        const css = generateTypographyCSS(settings);
        
        expect(css).toContain('body.wp-admin #wpbody-content');
        expect(css).toContain('font-size:14px!important;');
        expect(css).toContain('line-height:1.5!important;');
    });
});

describe('CSS Generation - Visual Effects', () => {
    it('should generate border radius CSS', () => {
        const settings = {
            visual_effects: {
                admin_bar: {
                    border_radius: 8
                }
            }
        };
        
        const css = generateVisualEffectsCSS(settings);
        
        expect(css).toContain('border-radius:8px!important;');
    });
    
    it('should generate box shadow CSS', () => {
        const settings = {
            visual_effects: {
                admin_bar: {
                    shadow_intensity: 'medium',
                    shadow_direction: 'bottom',
                    shadow_blur: 10,
                    shadow_color: 'rgba(0,0,0,0.15)'
                }
            }
        };
        
        const css = generateVisualEffectsCSS(settings);
        
        expect(css).toContain('box-shadow:0px 4px 10px 0px rgba(0,0,0,0.15)!important;');
    });
});

describe('CSS Generation - Complete Integration', () => {
    it('should generate complete CSS from all settings', () => {
        const settings = {
            admin_bar: {
                bg_color: '#ff0000',
                text_color: '#ffffff',
                height: 40
            },
            admin_menu: {
                bg_color: '#00ff00',
                text_color: '#000000',
                width: 200
            },
            typography: {
                admin_bar: {
                    font_size: 14
                },
                admin_menu: {
                    font_size: 13
                }
            },
            visual_effects: {
                admin_bar: {
                    border_radius: 8
                },
                admin_menu: {
                    shadow_intensity: 'subtle',
                    shadow_direction: 'bottom'
                }
            }
        };
        
        const css = generateCSS(settings);
        
        // Check admin bar CSS
        expect(css).toContain('background-color:#ff0000!important;');
        expect(css).toContain('height:40px!important;');
        
        // Check admin menu CSS
        expect(css).toContain('background-color:#00ff00!important;');
        expect(css).toContain('width:200px!important;');
        
        // Check typography CSS
        expect(css).toContain('font-size:14px!important;');
        expect(css).toContain('font-size:13px!important;');
        
        // Check visual effects CSS
        expect(css).toContain('border-radius:8px!important;');
        expect(css).toContain('box-shadow:0px 2px 10px 0px rgba(0,0,0,0.15)!important;');
    });
    
    it('should handle empty settings gracefully', () => {
        const settings = {};
        const css = generateCSS(settings);
        
        // Should still generate some CSS (defaults)
        expect(css).toBeTruthy();
        expect(css.length).toBeGreaterThan(0);
    });
    
    it('should handle partial settings', () => {
        const settings = {
            admin_bar: {
                bg_color: '#ff0000'
            }
            // Missing admin_menu, typography, visual_effects
        };
        
        const css = generateCSS(settings);
        
        expect(css).toContain('background-color:#ff0000!important;');
        expect(css).toBeTruthy();
    });
});

describe('CSS Generation - Performance', () => {
    it('should generate CSS within 50ms', () => {
        const settings = {
            admin_bar: {
                bg_color: '#23282d',
                text_color: '#ffffff',
                height: 32
            },
            admin_menu: {
                bg_color: '#23282d',
                text_color: '#ffffff',
                width: 160
            },
            typography: {
                admin_bar: { font_size: 13 },
                admin_menu: { font_size: 13 },
                content: { font_size: 13 }
            },
            visual_effects: {
                admin_bar: { border_radius: 0 },
                admin_menu: { border_radius: 0 }
            }
        };
        
        const startTime = performance.now();
        generateCSS(settings);
        const endTime = performance.now();
        
        const duration = endTime - startTime;
        expect(duration).toBeLessThan(50);
    });
});
