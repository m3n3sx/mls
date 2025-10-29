<?php
/**
 * Fix: Force admin bar to be visible on MASE settings page
 * 
 * Add this code to includes/class-mase-admin.php in the enqueue_assets() function
 */

// Add to enqueue_assets() function after line 250:

// Force admin bar to be visible on settings page
add_action('admin_head', function() {
    global $hook_suffix;
    if ('toplevel_page_mase-settings' === $hook_suffix) {
        ?>
        <style id="mase-force-adminbar">
            /* Force admin bar to be visible on settings page */
            #wpadminbar {
                display: flex !important;
                visibility: visible !important;
                opacity: 1 !important;
            }
            
            /* Ensure proper stacking */
            .mase-settings-wrap,
            .wrap.mase-settings-wrap {
                position: relative !important;
                z-index: 1 !important;
            }
            
            /* Ensure admin bar is above everything */
            #wpadminbar {
                z-index: 99999 !important;
            }
        </style>
        <?php
    }
});
