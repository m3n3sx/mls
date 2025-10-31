/**
 * Enhanced Retro Theme Effects
 * Handles initialization and dynamic effects for retro theme
 */

(function($) {
    'use strict';

    /**
     * Retro Effects Controller
     */
    const MASERetroEffects = {
        /**
         * Initialize retro effects
         */
        init: function() {
            if (!this.isRetroThemeActive()) {
                return;
            }

            this.setupChromaticAberration();
            this.createOverlayElements();
            this.enableVHSMode();
            this.handleIntensityChanges();
            
            console.log('MASE: Retro theme effects initialized');
        },

        /**
         * Check if retro theme is active
         */
        isRetroThemeActive: function() {
            return $('body').hasClass('mase-template-retro') || 
                   $('.mase-template-retro').length > 0;
        },

        /**
         * Setup chromatic aberration effect on headings
         * Adds data-text attribute for pseudo-element content
         */
        setupChromaticAberration: function() {
            const headings = $('.mase-template-retro h1, .mase-template-retro h2, .mase-template-retro h3');
            
            headings.each(function() {
                const $heading = $(this);
                const text = $heading.text();
                
                // Store original text in data attribute for pseudo-elements
                $heading.attr('data-text', text);
            });

            console.log('MASE: Chromatic aberration setup on ' + headings.length + ' headings');
        },

        /**
         * Create overlay elements for effects
         */
        createOverlayElements: function() {
            const $body = $('body');
            
            // Check if overlays already exist
            if ($('.retro-scanlines').length > 0) {
                return;
            }

            // Create scanlines overlay
            const $scanlines = $('<div>', {
                class: 'retro-scanlines',
                'aria-hidden': 'true'
            });

            // Create moving scanline
            const $movingScanline = $('<div>', {
                class: 'retro-scanline-moving',
                'aria-hidden': 'true'
            });

            // Create film grain overlay
            const $filmGrain = $('<div>', {
                class: 'retro-film-grain',
                'aria-hidden': 'true'
            });

            // Create vignette overlay
            const $vignette = $('<div>', {
                class: 'retro-vignette',
                'aria-hidden': 'true'
            });

            // Append overlays to body
            $body.append($scanlines);
            $body.append($movingScanline);
            $body.append($filmGrain);
            $body.append($vignette);

            console.log('MASE: Retro overlay elements created');
        },

        /**
         * Enable VHS distortion mode
         */
        enableVHSMode: function() {
            const $retroContainer = $('.mase-template-retro');
            
            if ($retroContainer.length === 0) {
                return;
            }

            // Add VHS enhanced class
            $retroContainer.addClass('vhs-enhanced');

            // Random glitch effect
            this.startRandomGlitches();

            console.log('MASE: VHS mode enabled');
        },

        /**
         * Start random glitch effects
         */
        startRandomGlitches: function() {
            const triggerGlitch = () => {
                const $retroContainer = $('.mase-template-retro.vhs-enhanced');
                
                if ($retroContainer.length === 0) {
                    return;
                }

                // Add temporary glitch class
                $retroContainer.addClass('glitching');

                // Remove after short duration
                setTimeout(() => {
                    $retroContainer.removeClass('glitching');
                }, 100);

                // Schedule next glitch randomly (5-15 seconds)
                const nextGlitch = Math.random() * 10000 + 5000;
                setTimeout(triggerGlitch, nextGlitch);
            };

            // Start glitch cycle
            const initialDelay = Math.random() * 5000 + 2000;
            setTimeout(triggerGlitch, initialDelay);
        },

        /**
         * Handle intensity changes
         */
        handleIntensityChanges: function() {
            $(document).on('mase:intensity-changed', (e, intensity) => {
                console.log('MASE: Retro theme intensity changed to ' + intensity);
                this.adjustEffectsIntensity(intensity);
            });
        },

        /**
         * Adjust effects based on intensity
         */
        adjustEffectsIntensity: function(intensity) {
            const $filmGrain = $('.retro-film-grain');
            const $scanline = $('.retro-scanline-moving');

            switch(intensity) {
                case 'low':
                    $filmGrain.css('opacity', '0.02');
                    $scanline.css('opacity', '0.15');
                    break;
                case 'high':
                    $filmGrain.css('opacity', '0.08');
                    $scanline.css('opacity', '0.5');
                    break;
                default: // medium
                    $filmGrain.css('opacity', '0.05');
                    $scanline.css('opacity', '0.3');
            }
        },

        /**
         * Cleanup effects
         */
        cleanup: function() {
            $('.retro-scanlines').remove();
            $('.retro-scanline-moving').remove();
            $('.retro-film-grain').remove();
            $('.retro-vignette').remove();
            $('.mase-template-retro').removeClass('vhs-enhanced glitching');
            
            console.log('MASE: Retro effects cleaned up');
        }
    };

    /**
     * Initialize on document ready
     */
    $(document).ready(function() {
        MASERetroEffects.init();
    });

    /**
     * Reinitialize when theme changes
     */
    $(document).on('mase:theme-changed', function(e, theme) {
        // Cleanup old effects
        MASERetroEffects.cleanup();

        // Reinitialize if retro theme
        if (theme === 'retro') {
            setTimeout(() => {
                MASERetroEffects.init();
            }, 100);
        }
    });

    /**
     * Handle performance mode
     */
    $(document).on('mase:performance-mode-changed', function(e, enabled) {
        if (enabled) {
            $('.retro-film-grain, .retro-scanline-moving').hide();
            $('.mase-template-retro.vhs-enhanced').css('animation', 'none');
        } else {
            $('.retro-film-grain, .retro-scanline-moving').show();
            $('.mase-template-retro.vhs-enhanced').css('animation', '');
        }
    });

    /**
     * Expose to global scope for external access
     */
    window.MASERetroEffects = MASERetroEffects;

})(jQuery);
