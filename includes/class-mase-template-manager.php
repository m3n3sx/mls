<?php
/**
 * Template Manager Class
 * Manages theme templates for Modern Admin Styler
 *
 * @package ModernAdminStyler
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class MASE_Template_Manager {
    
    /**
     * Available templates
     *
     * @var array
     */
    private $templates = array();
    
    /**
     * Constructor
     */
    public function __construct() {
        $this->register_templates();
    }
    
    /**
     * Register all available templates
     */
    private function register_templates() {
        $this->templates = array(
            'terminal' => array(
                'name'        => 'Terminal Linux',
                'description' => 'Hacker/Developer theme with matrix effects',
                'css_class'   => 'mase-template-terminal',
                'css_file'    => 'terminal-theme.css',
                'category'    => 'tech',
                'features'    => array( 'matrix-effects', 'monospace-font', 'green-glow' ),
            ),
            'gaming' => array(
                'name'        => 'Gaming Cyberpunk',
                'description' => 'Epic gaming theme with RGB neon effects',
                'css_class'   => 'mase-template-gaming',
                'css_file'    => 'gaming-theme.css',
                'category'    => 'gaming',
                'features'    => array( 'rgb-neon', 'cyberpunk', 'animated-borders' ),
            ),
            'floral' => array(
                'name'        => 'Floral Natural',
                'description' => 'Organic theme with pastel colors',
                'css_class'   => 'mase-template-floral',
                'css_file'    => 'floral-theme.css',
                'category'    => 'nature',
                'features'    => array( 'organic-shapes', 'pastel-colors', 'soft-animations' ),
            ),
            'professional' => array(
                'name'        => 'Professional Dark',
                'description' => 'Corporate elegance with gold accents',
                'css_class'   => 'mase-template-professional',
                'css_file'    => 'professional-theme.css',
                'category'    => 'business',
                'features'    => array( 'gold-accents', 'corporate', 'elegant' ),
            ),
            'retro' => array(
                'name'        => 'Retro 80s Synthwave',
                'description' => 'Nostalgic 80s theme with vaporwave aesthetics',
                'css_class'   => 'mase-template-retro',
                'css_file'    => 'retro-theme.css',
                'category'    => 'retro',
                'features'    => array( 'synthwave', 'animated-gradients', 'grid-overlay' ),
            ),
            'glass' => array(
                'name'        => 'Glass Material',
                'description' => 'Premium glassmorphism with prismatic effects',
                'css_class'   => 'mase-template-glass',
                'css_file'    => 'glass-theme.css',
                'category'    => 'modern',
                'features'    => array( 'glassmorphism', 'blur-effects', 'prismatic' ),
            ),
            'gradient' => array(
                'name'        => 'Gradient Flow',
                'description' => 'Dynamic theme with flowing gradients',
                'css_class'   => 'mase-template-gradient',
                'css_file'    => 'gradient-theme.css',
                'category'    => 'modern',
                'features'    => array( 'flowing-gradients', 'dynamic-colors', 'particle-effects' ),
            ),
            'minimal' => array(
                'name'        => 'Minimalist Modern',
                'description' => 'Clean design with focus on typography',
                'css_class'   => 'mase-template-minimal',
                'css_file'    => 'minimal-theme.css',
                'category'    => 'minimal',
                'features'    => array( 'clean-design', 'typography-focus', 'accessible' ),
            ),
        );
    }
    
    /**
     * Get all templates
     *
     * @return array
     */
    public function get_all_templates() {
        return $this->templates;
    }
    
    /**
     * Get template by ID
     *
     * @param string $template_id Template ID
     * @return array|null
     */
    public function get_template( $template_id ) {
        return isset( $this->templates[ $template_id ] ) ? $this->templates[ $template_id ] : null;
    }
    
    /**
     * Get templates by category
     *
     * @param string $category Category name
     * @return array
     */
    public function get_templates_by_category( $category ) {
        return array_filter( $this->templates, function( $template ) use ( $category ) {
            return $template['category'] === $category;
        });
    }
    
    /**
     * Apply template
     *
     * @param string $template_id Template ID
     * @return bool
     */
    public function apply_template( $template_id ) {
        $template = $this->get_template( $template_id );
        
        if ( ! $template ) {
            return false;
        }
        
        // Get current settings
        $current_settings = get_option( 'mase_settings', array() );
        
        // Update active template
        $current_settings['active_template'] = $template_id;
        
        // Save settings
        $result = update_option( 'mase_settings', $current_settings );
        
        // Clear cache
        if ( class_exists( 'MASE_Cache' ) ) {
            MASE_Cache::clear_all();
        }
        
        return $result;
    }
    
    /**
     * Get active template
     *
     * @return string|null
     */
    public function get_active_template() {
        $settings = get_option( 'mase_settings', array() );
        return isset( $settings['active_template'] ) ? $settings['active_template'] : null;
    }
    
    /**
     * Enqueue template CSS
     *
     * @param string $template_id Template ID
     */
    public function enqueue_template_css( $template_id ) {
        $template = $this->get_template( $template_id );
        
        if ( ! $template || ! isset( $template['css_file'] ) ) {
            return;
        }
        
        $css_file = MASE_PLUGIN_DIR . 'assets/css/themes/' . $template['css_file'];
        $css_url  = MASE_PLUGIN_URL . 'assets/css/themes/' . $template['css_file'];
        
        if ( file_exists( $css_file ) ) {
            wp_enqueue_style(
                'mase-template-' . $template_id,
                $css_url,
                array(),
                filemtime( $css_file )
            );
        }
    }
    
    /**
     * Get template categories
     *
     * @return array
     */
    public function get_categories() {
        return array(
            'tech'     => 'Technology',
            'gaming'   => 'Gaming',
            'nature'   => 'Nature',
            'business' => 'Business',
            'retro'    => 'Retro',
            'modern'   => 'Modern',
            'minimal'  => 'Minimal',
        );
    }
}
