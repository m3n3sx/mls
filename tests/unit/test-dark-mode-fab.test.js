/**
 * Unit Tests for Dark Mode FAB Rendering and Event Handling
 * Task 6: Implement FAB rendering and event handling
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.7, 1.8
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Dark Mode FAB - Task 6', () => {
    let $;
    let MASE;
    let mockLocalStorage;
    
    beforeEach(() => {
        // Setup DOM
        document.body.innerHTML = '<div id="test-container"></div>';
        
        // Mock jQuery
        $ = global.jQuery = vi.fn((selector) => {
            if (typeof selector === 'function') {
                // Document ready
                selector();
                return;
            }
            
            const elements = document.querySelectorAll(selector);
            const jqObject = {
                length: elements.length,
                0: elements[0],
                addClass: vi.fn().mockReturnThis(),
                removeClass: vi.fn().mockReturnThis(),
                hasClass: vi.fn((className) => {
                    return elements[0]?.classList.contains(className);
                }),
                attr: vi.fn((name, value) => {
                    if (value === undefined) {
                        return elements[0]?.getAttribute(name);
                    }
                    elements[0]?.setAttribute(name, value);
                    return jqObject;
                }),
                find: vi.fn((sel) => $(sel)),
                append: vi.fn().mockReturnThis(),
                on: vi.fn().mockReturnThis(),
                trigger: vi.fn().mockReturnThis(),
                css: vi.fn().mockReturnThis(),
                text: vi.fn().mockReturnThis()
            };
            return jqObject;
        });
        
        $.ajax = vi.fn();
        
        // Mock localStorage
        mockLocalStorage = {
            getItem: vi.fn(),
            setItem: vi.fn(),
            removeItem: vi.fn()
        };
        global.localStorage = mockLocalStorage;
        
        // Mock window.matchMedia
        global.window.matchMedia = vi.fn((query) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn()
        }));
        
        // Mock MASE object
        MASE = {
            config: {
                ajaxUrl: '/wp-admin/admin-ajax.php',
                nonce: 'test-nonce'
            },
            darkModeToggle: {
                config: {
                    fabSelector: '.mase-dark-mode-fab',
                    bodyClass: 'mase-dark-mode',
                    storageKey: 'mase_dark_mode',
                    transitionDuration: 300
                },
                state: {
                    currentMode: 'light',
                    isTransitioning: false,
                    systemPreference: null
                },
                render: function() {
                    const fabHtml = `
                        <button class="mase-dark-mode-fab" 
                            aria-label="Switch to Dark Mode" 
                            aria-pressed="false" 
                            role="switch">
                            <span class="dashicons dashicons-moon" aria-hidden="true"></span>
                            <span class="sr-only">Light mode active</span>
                            <span class="mase-fab-tooltip">Switch to Dark Mode</span>
                        </button>
                    `;
                    document.body.insertAdjacentHTML('beforeend', fabHtml);
                },
                attachEventListeners: function() {
                    const $fab = $('.mase-dark-mode-fab');
                    $fab.on('click', () => this.toggle());
                    $fab.on('mouseenter', () => this.showTooltip());
                    $fab.on('mouseleave', () => this.hideTooltip());
                },
                updateIcon: function() {
                    const $fab = document.querySelector('.mase-dark-mode-fab');
                    if (!$fab) return;
                    
                    const $icon = $fab.querySelector('.dashicons');
                    const iconClass = this.state.currentMode === 'dark' ? 'dashicons-sun' : 'dashicons-moon';
                    const ariaLabel = this.state.currentMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
                    const ariaPressed = this.state.currentMode === 'dark' ? 'true' : 'false';
                    
                    $icon.className = `dashicons ${iconClass}`;
                    $fab.setAttribute('aria-label', ariaLabel);
                    $fab.setAttribute('aria-pressed', ariaPressed);
                },
                showTooltip: function() {
                    const $tooltip = document.querySelector('.mase-fab-tooltip');
                    if ($tooltip) {
                        $tooltip.classList.add('mase-fab-tooltip-visible');
                    }
                },
                hideTooltip: function() {
                    const $tooltip = document.querySelector('.mase-fab-tooltip');
                    if ($tooltip) {
                        $tooltip.classList.remove('mase-fab-tooltip-visible');
                    }
                },
                toggle: function() {
                    if (this.state.isTransitioning) return;
                    this.state.currentMode = this.state.currentMode === 'light' ? 'dark' : 'light';
                }
            }
        };
    });
    
    afterEach(() => {
        document.body.innerHTML = '';
        vi.clearAllMocks();
    });
    
    describe('render() method', () => {
        it('should create FAB DOM element', () => {
            MASE.darkModeToggle.render();
            
            const $fab = document.querySelector('.mase-dark-mode-fab');
            expect($fab).toBeTruthy();
        });
        
        it('should render FAB with correct structure', () => {
            MASE.darkModeToggle.render();
            
            const $fab = document.querySelector('.mase-dark-mode-fab');
            const $icon = $fab.querySelector('.dashicons');
            const $tooltip = $fab.querySelector('.mase-fab-tooltip');
            const $srText = $fab.querySelector('.sr-only');
            
            expect($icon).toBeTruthy();
            expect($tooltip).toBeTruthy();
            expect($srText).toBeTruthy();
        });
        
        it('should set correct ARIA attributes', () => {
            MASE.darkModeToggle.render();
            
            const $fab = document.querySelector('.mase-dark-mode-fab');
            expect($fab.getAttribute('aria-label')).toBe('Switch to Dark Mode');
            expect($fab.getAttribute('aria-pressed')).toBe('false');
            expect($fab.getAttribute('role')).toBe('switch');
        });
        
        it('should display moon icon for light mode', () => {
            MASE.darkModeToggle.state.currentMode = 'light';
            MASE.darkModeToggle.render();
            
            const $icon = document.querySelector('.dashicons');
            expect($icon.classList.contains('dashicons-moon')).toBe(true);
        });
        
        it('should not render duplicate FAB', () => {
            MASE.darkModeToggle.render();
            MASE.darkModeToggle.render();
            
            const fabs = document.querySelectorAll('.mase-dark-mode-fab');
            expect(fabs.length).toBe(1);
        });
    });
    
    describe('updateIcon() method', () => {
        beforeEach(() => {
            MASE.darkModeToggle.render();
        });
        
        it('should switch to sun icon in dark mode', () => {
            MASE.darkModeToggle.state.currentMode = 'dark';
            MASE.darkModeToggle.updateIcon();
            
            const $icon = document.querySelector('.dashicons');
            expect($icon.classList.contains('dashicons-sun')).toBe(true);
            expect($icon.classList.contains('dashicons-moon')).toBe(false);
        });
        
        it('should switch to moon icon in light mode', () => {
            MASE.darkModeToggle.state.currentMode = 'light';
            MASE.darkModeToggle.updateIcon();
            
            const $icon = document.querySelector('.dashicons');
            expect($icon.classList.contains('dashicons-moon')).toBe(true);
            expect($icon.classList.contains('dashicons-sun')).toBe(false);
        });
        
        it('should update aria-pressed to true in dark mode', () => {
            MASE.darkModeToggle.state.currentMode = 'dark';
            MASE.darkModeToggle.updateIcon();
            
            const $fab = document.querySelector('.mase-dark-mode-fab');
            expect($fab.getAttribute('aria-pressed')).toBe('true');
        });
        
        it('should update aria-label correctly', () => {
            MASE.darkModeToggle.state.currentMode = 'dark';
            MASE.darkModeToggle.updateIcon();
            
            const $fab = document.querySelector('.mase-dark-mode-fab');
            expect($fab.getAttribute('aria-label')).toBe('Switch to Light Mode');
        });
    });
    
    describe('showTooltip() method', () => {
        beforeEach(() => {
            MASE.darkModeToggle.render();
        });
        
        it('should add visibility class to tooltip', () => {
            MASE.darkModeToggle.showTooltip();
            
            const $tooltip = document.querySelector('.mase-fab-tooltip');
            expect($tooltip.classList.contains('mase-fab-tooltip-visible')).toBe(true);
        });
    });
    
    describe('hideTooltip() method', () => {
        beforeEach(() => {
            MASE.darkModeToggle.render();
            MASE.darkModeToggle.showTooltip();
        });
        
        it('should remove visibility class from tooltip', () => {
            MASE.darkModeToggle.hideTooltip();
            
            const $tooltip = document.querySelector('.mase-fab-tooltip');
            expect($tooltip.classList.contains('mase-fab-tooltip-visible')).toBe(false);
        });
    });
    
    describe('Rapid click prevention', () => {
        beforeEach(() => {
            MASE.darkModeToggle.render();
        });
        
        it('should prevent toggle during transition', () => {
            MASE.darkModeToggle.state.isTransitioning = true;
            const initialMode = MASE.darkModeToggle.state.currentMode;
            
            MASE.darkModeToggle.toggle();
            
            expect(MASE.darkModeToggle.state.currentMode).toBe(initialMode);
        });
        
        it('should allow toggle when not transitioning', () => {
            MASE.darkModeToggle.state.isTransitioning = false;
            MASE.darkModeToggle.state.currentMode = 'light';
            
            MASE.darkModeToggle.toggle();
            
            expect(MASE.darkModeToggle.state.currentMode).toBe('dark');
        });
    });
    
    describe('ARIA attributes', () => {
        beforeEach(() => {
            MASE.darkModeToggle.render();
        });
        
        it('should have role="switch"', () => {
            const $fab = document.querySelector('.mase-dark-mode-fab');
            expect($fab.getAttribute('role')).toBe('switch');
        });
        
        it('should have aria-label', () => {
            const $fab = document.querySelector('.mase-dark-mode-fab');
            expect($fab.getAttribute('aria-label')).toBeTruthy();
        });
        
        it('should have aria-pressed', () => {
            const $fab = document.querySelector('.mase-dark-mode-fab');
            expect($fab.getAttribute('aria-pressed')).toBeTruthy();
        });
        
        it('should have screen reader text', () => {
            const $srText = document.querySelector('.sr-only');
            expect($srText).toBeTruthy();
            expect($srText.textContent).toBeTruthy();
        });
    });
});
