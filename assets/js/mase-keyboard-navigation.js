/**
 * MASE Keyboard Navigation Enhancement
 * 
 * Enhances keyboard accessibility for Material Design 3 components
 * Requirements: 21.3 - Ensure all interactive elements are keyboard accessible
 * 
 * Features:
 * - Tab order management
 * - Arrow key navigation for tabs
 * - Enter/Space activation for custom controls
 * - Focus trap for modals
 * - Skip links
 */

(function($) {
    'use strict';

    /**
     * Keyboard Navigation Manager
     */
    const MASEKeyboardNav = {
        /**
         * Initialize keyboard navigation
         */
        init: function() {
            this.initTabNavigation();
            this.initTemplateCardNavigation();
            this.initToggleSwitchNavigation();
            this.initModalFocusTrap();
            this.initSkipLinks();
            this.ensureTabIndex();
            
            console.log('MASE Keyboard Navigation initialized');
        },

        /**
         * Initialize tab navigation with arrow keys
         */
        initTabNavigation: function() {
            const $tabs = $('.mase-nav-tab');
            
            if ($tabs.length === 0) return;

            $tabs.on('keydown', function(e) {
                const $currentTab = $(this);
                const $allTabs = $('.mase-nav-tab');
                const currentIndex = $allTabs.index($currentTab);
                let $nextTab = null;

                switch(e.key) {
                    case 'ArrowRight':
                    case 'ArrowDown':
                        e.preventDefault();
                        $nextTab = $allTabs.eq((currentIndex + 1) % $allTabs.length);
                        break;
                    
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        $nextTab = $allTabs.eq((currentIndex - 1 + $allTabs.length) % $allTabs.length);
                        break;
                    
                    case 'Home':
                        e.preventDefault();
                        $nextTab = $allTabs.first();
                        break;
                    
                    case 'End':
                        e.preventDefault();
                        $nextTab = $allTabs.last();
                        break;
                    
                    case 'Enter':
                    case ' ':
                        e.preventDefault();
                        $currentTab.click();
                        break;
                }

                if ($nextTab) {
                    $nextTab.focus();
                }
            });

            // Set proper ARIA attributes
            $tabs.each(function(index) {
                const $tab = $(this);
                const isActive = $tab.hasClass('active');
                
                $tab.attr({
                    'role': 'tab',
                    'aria-selected': isActive ? 'true' : 'false',
                    'tabindex': isActive ? '0' : '-1'
                });
            });

            // Update ARIA when tab changes
            $tabs.on('click', function() {
                const $clickedTab = $(this);
                
                $tabs.attr({
                    'aria-selected': 'false',
                    'tabindex': '-1'
                });
                
                $clickedTab.attr({
                    'aria-selected': 'true',
                    'tabindex': '0'
                });
            });
        },

        /**
         * Initialize template card keyboard navigation
         */
        initTemplateCardNavigation: function() {
            const $cards = $('.mase-template-card');
            
            if ($cards.length === 0) return;

            $cards.each(function() {
                const $card = $(this);
                
                // Ensure card is focusable
                if (!$card.attr('tabindex')) {
                    $card.attr('tabindex', '0');
                }
                
                // Add ARIA role
                $card.attr('role', 'button');
                
                // Add keyboard activation
                $card.on('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        
                        // Find and click the apply button
                        const $applyBtn = $card.find('.mase-template-apply');
                        if ($applyBtn.length) {
                            $applyBtn.click();
                        } else {
                            $card.click();
                        }
                    }
                });
            });
        },

        /**
         * Initialize toggle switch keyboard navigation
         */
        initToggleSwitchNavigation: function() {
            const $toggles = $('.mase-toggle');
            
            if ($toggles.length === 0) return;

            $toggles.each(function() {
                const $toggle = $(this);
                
                // Ensure toggle is focusable
                if (!$toggle.attr('tabindex')) {
                    $toggle.attr('tabindex', '0');
                }
                
                // Add ARIA attributes
                const isActive = $toggle.hasClass('active');
                $toggle.attr({
                    'role': 'switch',
                    'aria-checked': isActive ? 'true' : 'false'
                });
                
                // Add keyboard activation
                $toggle.on('keydown', function(e) {
                    if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        $toggle.click();
                    }
                });
                
                // Update ARIA on change
                $toggle.on('click', function() {
                    const newState = $toggle.hasClass('active');
                    $toggle.attr('aria-checked', newState ? 'true' : 'false');
                });
            });
        },

        /**
         * Initialize modal focus trap
         */
        initModalFocusTrap: function() {
            const self = this;
            
            $(document).on('mase:modal:open', function(e, $modal) {
                self.trapFocus($modal);
            });
            
            $(document).on('mase:modal:close', function(e, $previousFocus) {
                if ($previousFocus && $previousFocus.length) {
                    $previousFocus.focus();
                }
            });
        },

        /**
         * Trap focus within a modal
         * @param {jQuery} $modal - Modal element
         */
        trapFocus: function($modal) {
            const $focusableElements = $modal.find(
                'a[href], button:not([disabled]), textarea:not([disabled]), ' +
                'input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            
            if ($focusableElements.length === 0) return;
            
            const $firstFocusable = $focusableElements.first();
            const $lastFocusable = $focusableElements.last();
            
            // Focus first element
            $firstFocusable.focus();
            
            // Trap focus
            $modal.on('keydown.focustrap', function(e) {
                if (e.key !== 'Tab') return;
                
                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === $firstFocusable[0]) {
                        e.preventDefault();
                        $lastFocusable.focus();
                    }
                } else {
                    // Tab
                    if (document.activeElement === $lastFocusable[0]) {
                        e.preventDefault();
                        $firstFocusable.focus();
                    }
                }
            });
            
            // Close on Escape
            $modal.on('keydown.escape', function(e) {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    $(document).trigger('mase:modal:close', [$modal.data('previousFocus')]);
                }
            });
        },

        /**
         * Initialize skip links
         */
        initSkipLinks: function() {
            // Add skip link if not present
            if ($('.mase-skip-link').length === 0) {
                const $skipLink = $('<a>', {
                    'href': '#mase-main-content',
                    'class': 'mase-skip-link',
                    'text': 'Skip to main content'
                });
                
                $('body').prepend($skipLink);
            }
            
            // Add ID to main content if not present
            const $mainContent = $('.wrap').first();
            if ($mainContent.length && !$mainContent.attr('id')) {
                $mainContent.attr('id', 'mase-main-content');
            }
            
            // Handle skip link click
            $('.mase-skip-link').on('click', function(e) {
                e.preventDefault();
                const target = $(this).attr('href');
                const $target = $(target);
                
                if ($target.length) {
                    // Make target focusable temporarily
                    $target.attr('tabindex', '-1');
                    $target.focus();
                    
                    // Remove tabindex after focus
                    $target.one('blur', function() {
                        $(this).removeAttr('tabindex');
                    });
                    
                    // Scroll to target
                    $target[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        },

        /**
         * Ensure all interactive elements have proper tabindex
         */
        ensureTabIndex: function() {
            // Template cards
            $('.mase-template-card').each(function() {
                const $card = $(this);
                if (!$card.attr('tabindex')) {
                    $card.attr('tabindex', '0');
                }
            });
            
            // Color pickers
            $('.mase-color-picker').each(function() {
                const $picker = $(this);
                if (!$picker.attr('tabindex')) {
                    $picker.attr('tabindex', '0');
                }
            });
            
            // Toggle switches
            $('.mase-toggle').each(function() {
                const $toggle = $(this);
                if (!$toggle.attr('tabindex')) {
                    $toggle.attr('tabindex', '0');
                }
            });
            
            // FAB
            $('.mase-fab').each(function() {
                const $fab = $(this);
                if (!$fab.attr('tabindex')) {
                    $fab.attr('tabindex', '0');
                }
            });
        },

        /**
         * Get all focusable elements in a container
         * @param {jQuery} $container - Container element
         * @returns {jQuery} Focusable elements
         */
        getFocusableElements: function($container) {
            return $container.find(
                'a[href]:not([disabled]), ' +
                'button:not([disabled]), ' +
                'textarea:not([disabled]), ' +
                'input:not([disabled]), ' +
                'select:not([disabled]), ' +
                '[tabindex]:not([tabindex="-1"]):not([disabled])'
            ).filter(':visible');
        },

        /**
         * Move focus to next focusable element
         * @param {jQuery} $current - Current focused element
         */
        focusNext: function($current) {
            const $focusable = this.getFocusableElements($(document.body));
            const currentIndex = $focusable.index($current);
            const $next = $focusable.eq((currentIndex + 1) % $focusable.length);
            
            if ($next.length) {
                $next.focus();
            }
        },

        /**
         * Move focus to previous focusable element
         * @param {jQuery} $current - Current focused element
         */
        focusPrevious: function($current) {
            const $focusable = this.getFocusableElements($(document.body));
            const currentIndex = $focusable.index($current);
            const $prev = $focusable.eq((currentIndex - 1 + $focusable.length) % $focusable.length);
            
            if ($prev.length) {
                $prev.focus();
            }
        }
    };

    /**
     * Initialize on document ready
     */
    $(document).ready(function() {
        MASEKeyboardNav.init();
    });

    /**
     * Expose to global scope for external access
     */
    window.MASEKeyboardNav = MASEKeyboardNav;

})(jQuery);
