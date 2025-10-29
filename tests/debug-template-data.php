<?php
/**
 * Debug script to check template data
 * 
 * Add this to your functions.php temporarily:
 * add_action('admin_footer', function() { include 'path/to/this/file.php'; });
 */

if (!defined('ABSPATH')) {
    die('Direct access not allowed');
}
?>
<script>
console.log('=== MASE Template Debug ===');
console.log('maseAdmin exists:', typeof window.maseAdmin !== 'undefined');
if (typeof window.maseAdmin !== 'undefined') {
    console.log('themeTemplates:', window.maseAdmin.themeTemplates);
    console.log('activeTemplate:', window.maseAdmin.activeTemplate);
    console.log('templateCategories:', window.maseAdmin.templateCategories);
    console.log('Number of templates:', Object.keys(window.maseAdmin.themeTemplates || {}).length);
}
console.log('Template picker container exists:', jQuery('#mase-template-picker-grid').length > 0);
console.log('=== End Debug ===');
</script>
<?php
