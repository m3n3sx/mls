<?php
/**
 * Test script for thumbnail generation
 * 
 * This script tests the generate_template_thumbnail() method
 * and verifies that all templates receive thumbnails.
 */

// Mock WordPress functions for testing
if ( ! function_exists( 'esc_html' ) ) {
	function esc_html( $text ) {
		return htmlspecialchars( $text, ENT_QUOTES, 'UTF-8' );
	}
}

if ( ! function_exists( 'get_option' ) ) {
	function get_option( $option, $default = false ) {
		return $default;
	}
}

if ( ! function_exists( 'update_option' ) ) {
	function update_option( $option, $value ) {
		return true;
	}
}

if ( ! function_exists( 'sanitize_hex_color' ) ) {
	function sanitize_hex_color( $color ) {
		if ( preg_match( '/^#[0-9A-Fa-f]{6}$/', $color ) ) {
			return $color;
		}
		return false;
	}
}

if ( ! function_exists( 'sanitize_text_field' ) ) {
	function sanitize_text_field( $str ) {
		return strip_tags( $str );
	}
}

if ( ! function_exists( 'sanitize_textarea_field' ) ) {
	function sanitize_textarea_field( $str ) {
		return strip_tags( $str );
	}
}

if ( ! function_exists( 'wp_kses_post' ) ) {
	function wp_kses_post( $data ) {
		return $data;
	}
}

if ( ! function_exists( 'absint' ) ) {
	function absint( $maybeint ) {
		return abs( intval( $maybeint ) );
	}
}

if ( ! function_exists( 'current_time' ) ) {
	function current_time( $type, $gmt = 0 ) {
		return date( $type );
	}
}

if ( ! class_exists( 'WP_Error' ) ) {
	class WP_Error {
		private $errors = array();
		private $error_data = array();
		
		public function __construct( $code = '', $message = '', $data = '' ) {
			if ( ! empty( $code ) ) {
				$this->errors[ $code ][] = $message;
				if ( ! empty( $data ) ) {
					$this->error_data[ $code ] = $data;
				}
			}
		}
		
		public function get_error_message( $code = '' ) {
			if ( empty( $code ) ) {
				$code = $this->get_error_code();
			}
			if ( isset( $this->errors[ $code ][0] ) ) {
				return $this->errors[ $code ][0];
			}
			return '';
		}
		
		public function get_error_code() {
			$codes = array_keys( $this->errors );
			return $codes[0] ?? '';
		}
		
		public function get_error_data( $code = '' ) {
			if ( empty( $code ) ) {
				$code = $this->get_error_code();
			}
			return $this->error_data[ $code ] ?? null;
		}
	}
}

if ( ! function_exists( 'is_wp_error' ) ) {
	function is_wp_error( $thing ) {
		return ( $thing instanceof WP_Error );
	}
}

// Load the MASE_Settings class
require_once __DIR__ . '/includes/class-mase-settings.php';

// Create instance
$settings = new MASE_Settings();

echo "Testing Template Thumbnail Generation\n";
echo "======================================\n\n";

// Get all templates
$templates = $settings->get_all_templates();

echo "Total templates: " . count( $templates ) . "\n\n";

// Check each template for thumbnail
$success_count = 0;
$fail_count = 0;

foreach ( $templates as $template_id => $template ) {
	echo "Template: {$template['name']} (ID: {$template_id})\n";
	
	if ( isset( $template['thumbnail'] ) && ! empty( $template['thumbnail'] ) ) {
		// Check if it's a valid data URI
		if ( strpos( $template['thumbnail'], 'data:image/svg+xml;base64,' ) === 0 ) {
			echo "  ✓ Thumbnail: Valid data URI\n";
			
			// Decode and check SVG structure
			$base64_data = substr( $template['thumbnail'], strlen( 'data:image/svg+xml;base64,' ) );
			$svg_content = base64_decode( $base64_data );
			
			if ( strpos( $svg_content, '<svg' ) !== false && 
			     strpos( $svg_content, '<rect' ) !== false && 
			     strpos( $svg_content, '<text' ) !== false ) {
				echo "  ✓ SVG structure: Valid\n";
				
				// Check if template name is in SVG
				if ( strpos( $svg_content, $template['name'] ) !== false ) {
					echo "  ✓ Template name: Present in SVG\n";
					$success_count++;
				} else {
					echo "  ✗ Template name: NOT found in SVG\n";
					$fail_count++;
				}
			} else {
				echo "  ✗ SVG structure: Invalid\n";
				$fail_count++;
			}
		} else {
			echo "  ✗ Thumbnail: Invalid data URI format\n";
			$fail_count++;
		}
	} else {
		echo "  ✗ Thumbnail: Missing or empty\n";
		$fail_count++;
	}
	
	echo "\n";
}

echo "======================================\n";
echo "Results:\n";
echo "  Success: {$success_count}\n";
echo "  Failed: {$fail_count}\n";
echo "  Total: " . ( $success_count + $fail_count ) . "\n";

if ( $fail_count === 0 ) {
	echo "\n✓ All tests passed!\n";
	exit( 0 );
} else {
	echo "\n✗ Some tests failed!\n";
	exit( 1 );
}
