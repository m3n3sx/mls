/**
 * MASE Diagnostic Script
 * 
 * Run this in browser console to diagnose admin menu overlapping issues.
 * 
 * Usage:
 * 1. Open WordPress admin
 * 2. Open browser DevTools (F12)
 * 3. Paste this entire script into Console
 * 4. Run: MASE_Diagnostic.runFullDiagnostic()
 * 5. Copy the output and share with support
 * 
 * @version 1.0.0
 */

window.MASE_Diagnostic = {
	
	/**
	 * Run full diagnostic suite
	 */
	runFullDiagnostic: function() {
		console.log( '='.repeat(80) );
		console.log( 'MASE DIAGNOSTIC REPORT' );
		console.log( 'Generated: ' + new Date().toISOString() );
		console.log( '='.repeat(80) );
		console.log( '' );
		
		this.checkStyleTags();
		this.checkAdminMenu();
		this.checkAdminBar();
		this.checkCSSConflicts();
		this.checkZIndex();
		this.checkOverlappingElements();
		this.checkPluginConflicts();
		this.generateSummary();
		
		console.log( '' );
		console.log( '='.repeat(80) );
		console.log( 'DIAGNOSTIC COMPLETE' );
		console.log( '='.repeat(80) );
	},
	
	/**
	 * Check for duplicate or conflicting style tags
	 */
	checkStyleTags: function() {
		console.log( '--- STYLE TAGS CHECK ---' );
		
		const allStyles = document.querySelectorAll( 'style' );
		const maseStyles = document.querySelectorAll( 'style[id*="mase"]' );
		
		console.log( `Total <style> tags: ${allStyles.length}` );
		console.log( `MASE <style> tags: ${maseStyles.length}` );
		
		if ( maseStyles.length > 1 ) {
			console.warn( '⚠️ WARNING: Multiple MASE style tags detected!' );
		}
		
		maseStyles.forEach( ( style, index ) => {
			const id = style.id || 'no-id';
			const size = style.textContent.length;
			const sizeKB = ( size / 1024 ).toFixed( 2 );
			const comment = style.textContent.match( /\/\*.*?\*\// );
			const commentText = comment ? comment[0] : 'no comment';
			
			console.log( `  [${index + 1}] ID: ${id}, Size: ${sizeKB} KB, Comment: ${commentText}` );
		} );
		
		console.log( '' );
	},
	
	/**
	 * Check admin menu structure and styling
	 */
	checkAdminMenu: function() {
		console.log( '--- ADMIN MENU CHECK ---' );
		
		const adminMenu = document.querySelector( '#adminmenu' );
		
		if ( ! adminMenu ) {
			console.error( '❌ ERROR: #adminmenu not found!' );
			console.log( '' );
			return;
		}
		
		console.log( '✓ #adminmenu found' );
		
		// Check computed styles
		const styles = window.getComputedStyle( adminMenu );
		console.log( 'Computed styles:' );
		console.log( `  background: ${styles.background}` );
		console.log( `  background-color: ${styles.backgroundColor}` );
		console.log( `  display: ${styles.display}` );
		console.log( `  visibility: ${styles.visibility}` );
		console.log( `  opacity: ${styles.opacity}` );
		console.log( `  z-index: ${styles.zIndex}` );
		console.log( `  position: ${styles.position}` );
		
		// Check menu items
		const menuItems = adminMenu.querySelectorAll( 'li.menu-top' );
		console.log( `Menu items: ${menuItems.length}` );
		
		// Check for duplicate Dashboard items
		const dashboardItems = Array.from( menuItems ).filter( item => {
			const text = item.textContent.toLowerCase();
			return text.includes( 'dashboard' );
		} );
		
		if ( dashboardItems.length > 1 ) {
			console.warn( `⚠️ WARNING: ${dashboardItems.length} Dashboard items found (expected 1)` );
		} else {
			console.log( `✓ Dashboard items: ${dashboardItems.length}` );
		}
		
		// Check for overlapping elements
		const rect = adminMenu.getBoundingClientRect();
		console.log( 'Position:' );
		console.log( `  top: ${rect.top}px` );
		console.log( `  left: ${rect.left}px` );
		console.log( `  width: ${rect.width}px` );
		console.log( `  height: ${rect.height}px` );
		
		console.log( '' );
	},
	
	/**
	 * Check admin bar structure and styling
	 */
	checkAdminBar: function() {
		console.log( '--- ADMIN BAR CHECK ---' );
		
		const adminBar = document.querySelector( '#wpadminbar' );
		
		if ( ! adminBar ) {
			console.error( '❌ ERROR: #wpadminbar not found!' );
			console.log( '' );
			return;
		}
		
		console.log( '✓ #wpadminbar found' );
		
		// Check computed styles
		const styles = window.getComputedStyle( adminBar );
		console.log( 'Computed styles:' );
		console.log( `  background: ${styles.background}` );
		console.log( `  background-color: ${styles.backgroundColor}` );
		console.log( `  display: ${styles.display}` );
		console.log( `  visibility: ${styles.visibility}` );
		console.log( `  opacity: ${styles.opacity}` );
		console.log( `  z-index: ${styles.zIndex}` );
		console.log( `  position: ${styles.position}` );
		console.log( `  height: ${styles.height}` );
		
		console.log( '' );
	},
	
	/**
	 * Check for CSS conflicts
	 */
	checkCSSConflicts: function() {
		console.log( '--- CSS CONFLICTS CHECK ---' );
		
		const adminMenu = document.querySelector( '#adminmenu' );
		if ( ! adminMenu ) {
			console.log( 'Skipped (no #adminmenu)' );
			console.log( '' );
			return;
		}
		
		// Get all stylesheets
		const sheets = Array.from( document.styleSheets );
		const conflictingRules = [];
		
		sheets.forEach( sheet => {
			try {
				const rules = Array.from( sheet.cssRules || [] );
				rules.forEach( rule => {
					if ( rule.selectorText && rule.selectorText.includes( '#adminmenu' ) ) {
						conflictingRules.push( {
							selector: rule.selectorText,
							href: sheet.href || 'inline',
							cssText: rule.cssText.substring( 0, 100 )
						} );
					}
				} );
			} catch ( e ) {
				// Cross-origin stylesheet, skip
			}
		} );
		
		console.log( `Rules targeting #adminmenu: ${conflictingRules.length}` );
		
		if ( conflictingRules.length > 10 ) {
			console.warn( '⚠️ WARNING: Many rules targeting #adminmenu (possible conflicts)' );
		}
		
		// Show first 5 rules
		conflictingRules.slice( 0, 5 ).forEach( ( rule, index ) => {
			console.log( `  [${index + 1}] ${rule.selector}` );
			console.log( `      Source: ${rule.href}` );
		} );
		
		if ( conflictingRules.length > 5 ) {
			console.log( `  ... and ${conflictingRules.length - 5} more` );
		}
		
		console.log( '' );
	},
	
	/**
	 * Check z-index layering
	 */
	checkZIndex: function() {
		console.log( '--- Z-INDEX CHECK ---' );
		
		const elements = [
			{ selector: '#wpadminbar', name: 'Admin Bar' },
			{ selector: '#adminmenu', name: 'Admin Menu' },
			{ selector: '#adminmenuback', name: 'Admin Menu Background' },
			{ selector: '#adminmenuwrap', name: 'Admin Menu Wrap' },
			{ selector: '#wpcontent', name: 'Content Area' }
		];
		
		elements.forEach( item => {
			const el = document.querySelector( item.selector );
			if ( el ) {
				const zIndex = window.getComputedStyle( el ).zIndex;
				console.log( `  ${item.name}: z-index ${zIndex}` );
			} else {
				console.log( `  ${item.name}: not found` );
			}
		} );
		
		console.log( '' );
	},
	
	/**
	 * Check for overlapping elements
	 */
	checkOverlappingElements: function() {
		console.log( '--- OVERLAPPING ELEMENTS CHECK ---' );
		
		const adminMenu = document.querySelector( '#adminmenu' );
		if ( ! adminMenu ) {
			console.log( 'Skipped (no #adminmenu)' );
			console.log( '' );
			return;
		}
		
		const menuRect = adminMenu.getBoundingClientRect();
		const allElements = document.querySelectorAll( '*' );
		const overlapping = [];
		
		allElements.forEach( el => {
			if ( el === adminMenu || adminMenu.contains( el ) ) {
				return;
			}
			
			const rect = el.getBoundingClientRect();
			
			// Check if rectangles overlap
			if ( ! ( rect.right < menuRect.left ||
					rect.left > menuRect.right ||
					rect.bottom < menuRect.top ||
					rect.top > menuRect.bottom ) ) {
				
				const zIndex = window.getComputedStyle( el ).zIndex;
				if ( zIndex !== 'auto' && parseInt( zIndex ) > 0 ) {
					overlapping.push( {
						tag: el.tagName,
						id: el.id,
						classes: el.className,
						zIndex: zIndex
					} );
				}
			}
		} );
		
		if ( overlapping.length > 0 ) {
			console.warn( `⚠️ WARNING: ${overlapping.length} elements overlap with #adminmenu` );
			overlapping.slice( 0, 5 ).forEach( ( el, index ) => {
				console.log( `  [${index + 1}] <${el.tag}> id="${el.id}" z-index=${el.zIndex}` );
			} );
		} else {
			console.log( '✓ No overlapping elements detected' );
		}
		
		console.log( '' );
	},
	
	/**
	 * Check for plugin conflicts
	 */
	checkPluginConflicts: function() {
		console.log( '--- PLUGIN CONFLICTS CHECK ---' );
		
		// Check for common admin styling plugins
		const indicators = [
			{ selector: '[class*="admin-color"]', name: 'Admin Color Scheme' },
			{ selector: '[class*="custom-admin"]', name: 'Custom Admin Plugin' },
			{ selector: '[class*="white-label"]', name: 'White Label Plugin' },
			{ selector: 'style[id*="admin-style"]', name: 'Admin Style Plugin' }
		];
		
		indicators.forEach( item => {
			const found = document.querySelectorAll( item.selector );
			if ( found.length > 0 ) {
				console.log( `  ⚠️ ${item.name}: ${found.length} elements found` );
			}
		} );
		
		// Check for MASE-specific elements
		const maseElements = document.querySelectorAll( '[class*="mase"]' );
		console.log( `  MASE elements: ${maseElements.length}` );
		
		console.log( '' );
	},
	
	/**
	 * Generate diagnostic summary
	 */
	generateSummary: function() {
		console.log( '--- DIAGNOSTIC SUMMARY ---' );
		
		const issues = [];
		
		// Check for critical issues
		const maseStyles = document.querySelectorAll( 'style[id*="mase"]' );
		if ( maseStyles.length > 1 ) {
			issues.push( `Multiple MASE style tags (${maseStyles.length})` );
		}
		
		const adminMenu = document.querySelector( '#adminmenu' );
		if ( ! adminMenu ) {
			issues.push( 'Admin menu not found' );
		}
		
		if ( issues.length > 0 ) {
			console.warn( '⚠️ ISSUES DETECTED:' );
			issues.forEach( ( issue, index ) => {
				console.warn( `  ${index + 1}. ${issue}` );
			} );
		} else {
			console.log( '✓ No critical issues detected' );
		}
		
		console.log( '' );
		console.log( 'RECOMMENDATIONS:' );
		console.log( '  1. Check WordPress debug.log for MASE DIAGNOSTIC messages' );
		console.log( '  2. Disable other plugins temporarily to test for conflicts' );
		console.log( '  3. Clear browser cache and WordPress object cache' );
		console.log( '  4. Test in incognito/private browsing mode' );
		console.log( '  5. Try a different browser to rule out browser-specific issues' );
	}
};

// Auto-run on load if in debug mode
if ( window.location.search.includes( 'mase_debug=1' ) ) {
	console.log( 'MASE Debug mode detected - running diagnostic...' );
	setTimeout( function() {
		MASE_Diagnostic.runFullDiagnostic();
	}, 1000 );
}

console.log( '%cMASE Diagnostic Script Loaded', 'color: #2271b1; font-weight: bold; font-size: 14px;' );
console.log( 'Run: MASE_Diagnostic.runFullDiagnostic()' );
