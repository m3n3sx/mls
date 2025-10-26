<?php
/**
 * Script Enqueuing Verification Test
 * 
 * This test verifies that scripts and styles are enqueued correctly
 * with proper dependencies, versioning, and conditional loading.
 * 
 * Usage: Include this file in WordPress admin context and check output
 */

// Prevent direct access
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Test script enqueuing on settings page
 */
function mase_test_script_enqueuing() {
    global $wp_scripts, $wp_styles;
    
    echo '<div class="notice notice-info">';
    echo '<h2>MASE Script Enqueuing Verification Test</h2>';
    
    // Test 1: Check MASE_VERSION constant
    echo '<h3>Test 1: MASE_VERSION Constant</h3>';
    if ( defined( 'MASE_VERSION' ) ) {
        echo '<p>✅ MASE_VERSION is defined: <code>' . esc_html( MASE_VERSION ) . '</code></p>';
    } else {
        echo '<p>❌ MASE_VERSION is not defined</p>';
    }
    
    // Test 2: Check if mase-admin script is registered
    echo '<h3>Test 2: Script Registration</h3>';
    if ( isset( $wp_scripts->registered['mase-admin'] ) ) {
        $script = $wp_scripts->registered['mase-admin'];
        echo '<p>✅ mase-admin script is registered</p>';
        echo '<ul>';
        echo '<li>Handle: <code>' . esc_html( $script->handle ) . '</code></li>';
        echo '<li>Source: <code>' . esc_html( $script->src ) . '</code></li>';
        echo '<li>Version: <code>' . esc_html( $script->ver ) . '</code></li>';
        echo '<li>Dependencies: <code>' . esc_html( implode( ', ', $script->deps ) ) . '</code></li>';
        echo '<li>In Footer: <code>' . ( $script->extra['group'] === 1 ? 'true' : 'false' ) . '</code></li>';
        echo '</ul>';
        
        // Verify version matches MASE_VERSION
        if ( $script->ver === MASE_VERSION ) {
            echo '<p>✅ Version parameter uses MASE_VERSION constant</p>';
        } else {
            echo '<p>❌ Version parameter does not match MASE_VERSION</p>';
        }
        
        // Verify dependencies
        $required_deps = array( 'jquery', 'wp-color-picker' );
        $has_all_deps = true;
        foreach ( $required_deps as $dep ) {
            if ( ! in_array( $dep, $script->deps, true ) ) {
                $has_all_deps = false;
                echo '<p>❌ Missing dependency: ' . esc_html( $dep ) . '</p>';
            }
        }
        if ( $has_all_deps ) {
            echo '<p>✅ All required dependencies present</p>';
        }
    } else {
        echo '<p>❌ mase-admin script is not registered</p>';
    }
    
    // Test 3: Check if mase-admin style is registered
    echo '<h3>Test 3: Style Registration</h3>';
    if ( isset( $wp_styles->registered['mase-admin'] ) ) {
        $style = $wp_styles->registered['mase-admin'];
        echo '<p>✅ mase-admin style is registered</p>';
        echo '<ul>';
        echo '<li>Handle: <code>' . esc_html( $style->handle ) . '</code></li>';
        echo '<li>Source: <code>' . esc_html( $style->src ) . '</code></li>';
        echo '<li>Version: <code>' . esc_html( $style->ver ) . '</code></li>';
        echo '<li>Dependencies: <code>' . esc_html( implode( ', ', $style->deps ) ) . '</code></li>';
        echo '</ul>';
        
        // Verify version matches MASE_VERSION
        if ( $style->ver === MASE_VERSION ) {
            echo '<p>✅ Version parameter uses MASE_VERSION constant</p>';
        } else {
            echo '<p>❌ Version parameter does not match MASE_VERSION</p>';
        }
    } else {
        echo '<p>❌ mase-admin style is not registered</p>';
    }
    
    // Test 4: Check script localization
    echo '<h3>Test 4: Script Localization</h3>';
    if ( isset( $wp_scripts->registered['mase-admin'] ) ) {
        $script = $wp_scripts->registered['mase-admin'];
        if ( isset( $script->extra['data'] ) ) {
            echo '<p>✅ Script localization data exists</p>';
            
            // Check if maseAdmin object is defined
            if ( strpos( $script->extra['data'], 'maseAdmin' ) !== false ) {
                echo '<p>✅ maseAdmin object is localized</p>';
                
                // Check for required properties
                $required_props = array( 'ajaxUrl', 'nonce', 'palettes', 'templates', 'strings' );
                foreach ( $required_props as $prop ) {
                    if ( strpos( $script->extra['data'], $prop ) !== false ) {
                        echo '<p>✅ Property present: <code>' . esc_html( $prop ) . '</code></p>';
                    } else {
                        echo '<p>❌ Property missing: <code>' . esc_html( $prop ) . '</code></p>';
                    }
                }
            } else {
                echo '<p>❌ maseAdmin object not found in localization data</p>';
            }
        } else {
            echo '<p>❌ No localization data found</p>';
        }
    }
    
    // Test 5: Check conditional loading
    echo '<h3>Test 5: Conditional Loading</h3>';
    $current_screen = get_current_screen();
    if ( $current_screen ) {
        echo '<p>Current screen ID: <code>' . esc_html( $current_screen->id ) . '</code></p>';
        
        if ( $current_screen->id === 'toplevel_page_mase-settings' ) {
            echo '<p>✅ On MASE settings page - scripts should be loaded</p>';
            
            // Check if scripts are enqueued
            if ( wp_script_is( 'mase-admin', 'enqueued' ) ) {
                echo '<p>✅ mase-admin script is enqueued</p>';
            } else {
                echo '<p>❌ mase-admin script is not enqueued</p>';
            }
            
            if ( wp_style_is( 'mase-admin', 'enqueued' ) ) {
                echo '<p>✅ mase-admin style is enqueued</p>';
            } else {
                echo '<p>❌ mase-admin style is not enqueued</p>';
            }
        } else {
            echo '<p>ℹ️ Not on MASE settings page - scripts should not be loaded</p>';
            
            // Check if scripts are NOT enqueued
            if ( ! wp_script_is( 'mase-admin', 'enqueued' ) ) {
                echo '<p>✅ mase-admin script is correctly not enqueued</p>';
            } else {
                echo '<p>❌ mase-admin script should not be enqueued on this page</p>';
            }
        }
    }
    
    echo '</div>';
}

// Run test on admin pages
add_action( 'admin_notices', 'mase_test_script_enqueuing' );
