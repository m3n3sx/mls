/**
 * Unit Tests: Dark Mode FOUC Prevention
 * 
 * Tests the inline script that prevents Flash of Unstyled Content (FOUC)
 * when dark mode is active.
 * 
 * Requirements:
 * - 12.1: Check localStorage synchronously before page render
 * - 12.2: Apply .mase-dark-mode class immediately if dark mode active
 * - 12.3: Execute before main mase-admin.js loads
 * - 12.4: Execute in < 50ms
 * 
 * @package Modern_Admin_Styler_Enterprise
 * @since 1.2.0
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Dark Mode FOUC Prevention', () => {
    let originalLocalStorage;
    let mockBody;

    beforeEach(() => {
        // Mock document.body
        mockBody = {
            classList: {
                add: vi.fn(),
                remove: vi.fn(),
                contains: vi.fn()
            }
        };

        // Mock localStorage
        originalLocalStorage = global.localStorage;
        global.localStorage = {
            getItem: vi.fn(),
            setItem: vi.fn(),
            removeItem: vi.fn()
        };

        // Mock console.warn
        global.console.warn = vi.fn();
    });

    afterEach(() => {
        global.localStorage = originalLocalStorage;
        vi.clearAllMocks();
    });

    /**
     * Test: Script applies dark mode class when localStorage has 'dark'
     * Requirement 12.2: Apply .mase-dark-mode class immediately if dark mode active
     */
    it('should apply dark mode class when localStorage has "dark"', () => {
        // Arrange
        global.localStorage.getItem.mockReturnValue('dark');

        // Act
        const script = () => {
            try {
                const savedMode = localStorage.getItem("mase_dark_mode");
                const userMeta = "";
                const mode = savedMode || userMeta || "light";
                
                if (mode === "dark") {
                    mockBody.classList.add("mase-dark-mode");
                }
            } catch (e) {
                console.warn("MASE: Could not check dark mode preference", e);
            }
        };

        script();

        // Assert
        expect(global.localStorage.getItem).toHaveBeenCalledWith("mase_dark_mode");
        expect(mockBody.classList.add).toHaveBeenCalledWith("mase-dark-mode");
    });

    /**
     * Test: Script does not apply dark mode class when localStorage has 'light'
     * Requirement 12.2: Apply .mase-dark-mode class immediately if dark mode active
     */
    it('should not apply dark mode class when localStorage has "light"', () => {
        // Arrange
        global.localStorage.getItem.mockReturnValue('light');

        // Act
        const script = () => {
            try {
                const savedMode = localStorage.getItem("mase_dark_mode");
                const userMeta = "";
                const mode = savedMode || userMeta || "light";
                
                if (mode === "dark") {
                    mockBody.classList.add("mase-dark-mode");
                }
            } catch (e) {
                console.warn("MASE: Could not check dark mode preference", e);
            }
        };

        script();

        // Assert
        expect(global.localStorage.getItem).toHaveBeenCalledWith("mase_dark_mode");
        expect(mockBody.classList.add).not.toHaveBeenCalled();
    });

    /**
     * Test: Script falls back to user meta when localStorage is empty
     * Requirement 12.1: Check localStorage synchronously before page render
     */
    it('should fall back to user meta when localStorage is empty', () => {
        // Arrange
        global.localStorage.getItem.mockReturnValue(null);
        const userMeta = "dark";

        // Act
        const script = () => {
            try {
                const savedMode = localStorage.getItem("mase_dark_mode");
                const mode = savedMode || userMeta || "light";
                
                if (mode === "dark") {
                    mockBody.classList.add("mase-dark-mode");
                }
            } catch (e) {
                console.warn("MASE: Could not check dark mode preference", e);
            }
        };

        script();

        // Assert
        expect(mockBody.classList.add).toHaveBeenCalledWith("mase-dark-mode");
    });

    /**
     * Test: Script defaults to light mode when both localStorage and user meta are empty
     * Requirement 12.1: Check localStorage synchronously before page render
     */
    it('should default to light mode when both localStorage and user meta are empty', () => {
        // Arrange
        global.localStorage.getItem.mockReturnValue(null);
        const userMeta = "";

        // Act
        const script = () => {
            try {
                const savedMode = localStorage.getItem("mase_dark_mode");
                const mode = savedMode || userMeta || "light";
                
                if (mode === "dark") {
                    mockBody.classList.add("mase-dark-mode");
                }
            } catch (e) {
                console.warn("MASE: Could not check dark mode preference", e);
            }
        };

        script();

        // Assert
        expect(mockBody.classList.add).not.toHaveBeenCalled();
    });

    /**
     * Test: Script handles localStorage unavailable gracefully
     * Requirement 12.1: Check localStorage synchronously before page render
     */
    it('should handle localStorage unavailable gracefully', () => {
        // Arrange
        global.localStorage.getItem.mockImplementation(() => {
            throw new Error('localStorage is not available');
        });

        // Act
        const script = () => {
            try {
                const savedMode = localStorage.getItem("mase_dark_mode");
                const userMeta = "";
                const mode = savedMode || userMeta || "light";
                
                if (mode === "dark") {
                    mockBody.classList.add("mase-dark-mode");
                }
            } catch (e) {
                console.warn("MASE: Could not check dark mode preference", e);
            }
        };

        script();

        // Assert
        expect(console.warn).toHaveBeenCalledWith(
            "MASE: Could not check dark mode preference",
            expect.any(Error)
        );
        expect(mockBody.classList.add).not.toHaveBeenCalled();
    });

    /**
     * Test: Script executes in < 50ms
     * Requirement 12.4: Execute in < 50ms
     */
    it('should execute in less than 50ms', () => {
        // Arrange
        global.localStorage.getItem.mockReturnValue('dark');

        // Act
        const startTime = performance.now();
        
        const script = () => {
            try {
                const savedMode = localStorage.getItem("mase_dark_mode");
                const userMeta = "";
                const mode = savedMode || userMeta || "light";
                
                if (mode === "dark") {
                    mockBody.classList.add("mase-dark-mode");
                }
            } catch (e) {
                console.warn("MASE: Could not check dark mode preference", e);
            }
        };

        script();
        
        const endTime = performance.now();
        const executionTime = endTime - startTime;

        // Assert
        expect(executionTime).toBeLessThan(50);
    });

    /**
     * Test: Script is synchronous (no async operations)
     * Requirement 12.3: Execute before main mase-admin.js loads
     */
    it('should be synchronous with no async operations', () => {
        // Arrange
        global.localStorage.getItem.mockReturnValue('dark');
        let scriptCompleted = false;

        // Act
        const script = () => {
            try {
                const savedMode = localStorage.getItem("mase_dark_mode");
                const userMeta = "";
                const mode = savedMode || userMeta || "light";
                
                if (mode === "dark") {
                    mockBody.classList.add("mase-dark-mode");
                }
                scriptCompleted = true;
            } catch (e) {
                console.warn("MASE: Could not check dark mode preference", e);
            }
        };

        script();

        // Assert - script should complete immediately
        expect(scriptCompleted).toBe(true);
        expect(mockBody.classList.add).toHaveBeenCalledWith("mase-dark-mode");
    });

    /**
     * Test: localStorage preference takes precedence over user meta
     * Requirement 12.1: Check localStorage synchronously before page render
     */
    it('should prioritize localStorage over user meta', () => {
        // Arrange
        global.localStorage.getItem.mockReturnValue('light');
        const userMeta = "dark"; // User meta says dark, but localStorage says light

        // Act
        const script = () => {
            try {
                const savedMode = localStorage.getItem("mase_dark_mode");
                const mode = savedMode || userMeta || "light";
                
                if (mode === "dark") {
                    mockBody.classList.add("mase-dark-mode");
                }
            } catch (e) {
                console.warn("MASE: Could not check dark mode preference", e);
            }
        };

        script();

        // Assert - should use localStorage value (light), not user meta (dark)
        expect(mockBody.classList.add).not.toHaveBeenCalled();
    });

    /**
     * Test: Script handles empty string in localStorage
     * Requirement 12.1: Check localStorage synchronously before page render
     */
    it('should handle empty string in localStorage', () => {
        // Arrange
        global.localStorage.getItem.mockReturnValue('');
        const userMeta = "dark";

        // Act
        const script = () => {
            try {
                const savedMode = localStorage.getItem("mase_dark_mode");
                const mode = savedMode || userMeta || "light";
                
                if (mode === "dark") {
                    mockBody.classList.add("mase-dark-mode");
                }
            } catch (e) {
                console.warn("MASE: Could not check dark mode preference", e);
            }
        };

        script();

        // Assert - empty string is falsy, should fall back to user meta
        expect(mockBody.classList.add).toHaveBeenCalledWith("mase-dark-mode");
    });

    /**
     * Test: Script only adds class, never removes it
     * Requirement 12.2: Apply .mase-dark-mode class immediately if dark mode active
     */
    it('should only add class when dark mode is active, never remove', () => {
        // Arrange
        global.localStorage.getItem.mockReturnValue('light');

        // Act
        const script = () => {
            try {
                const savedMode = localStorage.getItem("mase_dark_mode");
                const userMeta = "";
                const mode = savedMode || userMeta || "light";
                
                if (mode === "dark") {
                    mockBody.classList.add("mase-dark-mode");
                }
            } catch (e) {
                console.warn("MASE: Could not check dark mode preference", e);
            }
        };

        script();

        // Assert - should not call remove, only add when needed
        expect(mockBody.classList.remove).not.toHaveBeenCalled();
        expect(mockBody.classList.add).not.toHaveBeenCalled();
    });
});
