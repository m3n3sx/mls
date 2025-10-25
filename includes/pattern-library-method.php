<?php
/**
 * Pattern Library Method for MASE_Settings
 * 
 * This file contains the get_pattern_library() method to be added to MASE_Settings class.
 * Task 19: Create pattern library data structure
 * Requirements: 3.1, 3.2
 */

/**
 * Get pattern library with 50+ SVG patterns.
 *
 * Provides SVG patterns organized by category (dots, lines, grids, organic).
 * Patterns use {color} placeholder for customization.
 * Filterable via WordPress filter hook for extensibility.
 * Requirements: 3.1, 3.2
 *
 * @return array Pattern library organized by category.
 */
public function get_pattern_library() {
	$patterns = array(
		// Dots category (10+ patterns)
		'dots' => array(
			'dot-grid' => array(
				'name'        => __( 'Dot Grid', 'mase' ),
				'category'    => 'dots',
				'description' => __( 'Simple grid of dots', 'mase' ),
				'svg'         => '<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><circle cx="2" cy="2" r="1" fill="{color}"/></svg>',
			),
			'dot-pattern' => array(
				'name'        => __( 'Dot Pattern', 'mase' ),
				'category'    => 'dots',
				'description' => __( 'Scattered dot pattern', 'mase' ),
				'svg'         => '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><circle cx="5" cy="5" r="2" fill="{color}"/><circle cx="25" cy="15" r="2" fill="{color}"/><circle cx="15" cy="30" r="2" fill="{color}"/></svg>',
			),
			'polka-dots' => array(
				'name'        => __( 'Polka Dots', 'mase' ),
				'category'    => 'dots',
				'description' => __( 'Classic polka dot pattern', 'mase' ),
				'svg'         => '<svg width="30" height="30" xmlns="http://www.w3.org/2000/svg"><circle cx="15" cy="15" r="4" fill="{color}"/></svg>',
			),
			'small-dots' => array(
				'name'        => __( 'Small Dots', 'mase' ),
				'category'    => 'dots',
				'description' => __( 'Tiny dot grid', 'mase' ),
				'svg'         => '<svg width="10" height="10" xmlns="http://www.w3.org/2000/svg"><circle cx="1" cy="1" r="0.5" fill="{color}"/></svg>',
			),
			'large-dots' => array(
				'name'        => __( 'Large Dots', 'mase' ),
				'category'    => 'dots',
				'description' => __( 'Large dot pattern', 'mase' ),
				'svg'         => '<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg"><circle cx="25" cy="25" r="8" fill="{color}"/></svg>',
			),
			'diagonal-dots' => array(
				'name'        => __( 'Diagonal Dots', 'mase' ),
				'category'    => 'dots',
				'description' => __( 'Dots arranged diagonally', 'mase' ),
				'svg'         => '<svg width="30" height="30" xmlns="http://www.w3.org/2000/svg"><circle cx="5" cy="5" r="2" fill="{color}"/><circle cx="15" cy="15" r="2" fill="{color}"/><circle cx="25" cy="25" r="2" fill="{color}"/></svg>',
			),
			'hexagon-dots' => array(
				'name'        => __( 'Hexagon Dots', 'mase' ),
				'category'    => 'dots',
				'description' => __( 'Dots in hexagonal arrangement', 'mase' ),
				'svg'         => '<svg width="40" height="35" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="2" fill="{color}"/><circle cx="30" cy="10" r="2" fill="{color}"/><circle cx="20" cy="25" r="2" fill="{color}"/></svg>',
			),
			'random-dots' => array(
				'name'        => __( 'Random Dots', 'mase' ),
				'category'    => 'dots',
				'description' => __( 'Randomly placed dots', 'mase' ),
				'svg'         => '<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="15" r="2" fill="{color}"/><circle cx="35" cy="8" r="2" fill="{color}"/><circle cx="50" cy="30" r="2" fill="{color}"/><circle cx="20" cy="45" r="2" fill="{color}"/><circle cx="45" cy="50" r="2" fill="{color}"/></svg>',
			),
			'dot-dash' => array(
				'name'        => __( 'Dot Dash', 'mase' ),
				'category'    => 'dots',
				'description' => __( 'Alternating dots and dashes', 'mase' ),
				'svg'         => '<svg width="40" height="20" xmlns="http://www.w3.org/2000/svg"><circle cx="5" cy="10" r="2" fill="{color}"/><rect x="15" y="9" width="10" height="2" fill="{color}"/><circle cx="35" cy="10" r="2" fill="{color}"/></svg>',
			),
			'concentric-dots' => array(
				'name'        => __( 'Concentric Dots', 'mase' ),
				'category'    => 'dots',
				'description' => __( 'Dots with concentric circles', 'mase' ),
				'svg'         => '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="3" fill="none" stroke="{color}" stroke-width="1"/><circle cx="20" cy="20" r="1.5" fill="{color}"/></svg>',
			),
		),
		
		// Lines category (15+ patterns)
		'lines' => array(
			'horizontal-lines' => array(
				'name'        => __( 'Horizontal Lines', 'mase' ),
				'category'    => 'lines',
				'description' => __( 'Horizontal stripe pattern', 'mase' ),
				'svg'         => '<svg width="100" height="20" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="10" x2="100" y2="10" stroke="{color}" stroke-width="2"/></svg>',
			),
			'vertical-lines' => array(
				'name'        => __( 'Vertical Lines', 'mase' ),
				'category'    => 'lines',
				'description' => __( 'Vertical stripe pattern', 'mase' ),
				'svg'         => '<svg width="20" height="100" xmlns="http://www.w3.org/2000/svg"><line x1="10" y1="0" x2="10" y2="100" stroke="{color}" stroke-width="2"/></svg>',
			),
			'diagonal-lines' => array(
				'name'        => __( 'Diagonal Lines', 'mase' ),
				'category'    => 'lines',
				'description' => __( 'Diagonal stripe pattern', 'mase' ),
				'svg'         => '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="40" y2="40" stroke="{color}" stroke-width="2"/></svg>',
			),
			'cross-hatch' => array(
				'name'        => __( 'Cross Hatch', 'mase' ),
				'category'    => 'lines',
				'description' => __( 'Crossed diagonal lines', 'mase' ),
				'svg'         => '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="40" y2="40" stroke="{color}" stroke-width="1"/><line x1="40" y1="0" x2="0" y2="40" stroke="{color}" stroke-width="1"/></svg>',
			),
			'zigzag' => array(
				'name'        => __( 'Zigzag', 'mase' ),
				'category'    => 'lines',
				'description' => __( 'Zigzag line pattern', 'mase' ),
				'svg'         => '<svg width="40" height="20" xmlns="http://www.w3.org/2000/svg"><polyline points="0,10 10,0 20,10 30,0 40,10" fill="none" stroke="{color}" stroke-width="2"/></svg>',
			),
			'chevron' => array(
				'name'        => __( 'Chevron', 'mase' ),
				'category'    => 'lines',
				'description' => __( 'Chevron arrow pattern', 'mase' ),
				'svg'         => '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><polyline points="0,0 20,20 40,0" fill="none" stroke="{color}" stroke-width="2"/></svg>',
			),
			'herringbone' => array(
				'name'        => __( 'Herringbone', 'mase' ),
				'category'    => 'lines',
				'description' => __( 'Herringbone pattern', 'mase' ),
				'svg'         => '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="20" x2="20" y2="0" stroke="{color}" stroke-width="2"/><line x1="20" y1="40" x2="40" y2="20" stroke="{color}" stroke-width="2"/></svg>',
			),
			'parallel-lines' => array(
				'name'        => __( 'Parallel Lines', 'mase' ),
				'category'    => 'lines',
				'description' => __( 'Multiple parallel lines', 'mase' ),
				'svg'         => '<svg width="100" height="30" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="5" x2="100" y2="5" stroke="{color}" stroke-width="1"/><line x1="0" y1="15" x2="100" y2="15" stroke="{color}" stroke-width="1"/><line x1="0" y1="25" x2="100" y2="25" stroke="{color}" stroke-width="1"/></svg>',
			),
			'dashed-lines' => array(
				'name'        => __( 'Dashed Lines', 'mase' ),
				'category'    => 'lines',
				'description' => __( 'Horizontal dashed lines', 'mase' ),
				'svg'         => '<svg width="100" height="20" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="10" x2="100" y2="10" stroke="{color}" stroke-width="2" stroke-dasharray="5,5"/></svg>',
			),
			'dotted-lines' => array(
				'name'        => __( 'Dotted Lines', 'mase' ),
				'category'    => 'lines',
				'description' => __( 'Horizontal dotted lines', 'mase' ),
				'svg'         => '<svg width="100" height="20" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="10" x2="100" y2="10" stroke="{color}" stroke-width="2" stroke-dasharray="2,5"/></svg>',
			),
			'wavy-lines' => array(
				'name'        => __( 'Wavy Lines', 'mase' ),
				'category'    => 'lines',
				'description' => __( 'Horizontal wavy lines', 'mase' ),
				'svg'         => '<svg width="60" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M0,10 Q15,0 30,10 T60,10" fill="none" stroke="{color}" stroke-width="2"/></svg>',
			),
			'railroad' => array(
				'name'        => __( 'Railroad', 'mase' ),
				'category'    => 'lines',
				'description' => __( 'Railroad track pattern', 'mase' ),
				'svg'         => '<svg width="100" height="30" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="5" x2="100" y2="5" stroke="{color}" stroke-width="2"/><line x1="0" y1="25" x2="100" y2="25" stroke="{color}" stroke-width="2"/><line x1="10" y1="5" x2="10" y2="25" stroke="{color}" stroke-width="1"/><line x1="30" y1="5" x2="30" y2="25" stroke="{color}" stroke-width="1"/><line x1="50" y1="5" x2="50" y2="25" stroke="{color}" stroke-width="1"/><line x1="70" y1="5" x2="70" y2="25" stroke="{color}" stroke-width="1"/><line x1="90" y1="5" x2="90" y2="25" stroke="{color}" stroke-width="1"/></svg>',
			),
			'brick-lines' => array(
				'name'        => __( 'Brick Lines', 'mase' ),
				'category'    => 'lines',
				'description' => __( 'Brick wall pattern', 'mase' ),
				'svg'         => '<svg width="60" height="40" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="30" height="20" fill="none" stroke="{color}" stroke-width="1"/><rect x="30" y="0" width="30" height="20" fill="none" stroke="{color}" stroke-width="1"/><rect x="15" y="20" width="30" height="20" fill="none" stroke="{color}" stroke-width="1"/></svg>',
			),
			'bamboo' => array(
				'name'        => __( 'Bamboo', 'mase' ),
				'category'    => 'lines',
				'description' => __( 'Bamboo stick pattern', 'mase' ),
				'svg'         => '<svg width="20" height="100" xmlns="http://www.w3.org/2000/svg"><line x1="10" y1="0" x2="10" y2="100" stroke="{color}" stroke-width="3"/><line x1="5" y1="20" x2="15" y2="20" stroke="{color}" stroke-width="1"/><line x1="5" y1="50" x2="15" y2="50" stroke="{color}" stroke-width="1"/><line x1="5" y1="80" x2="15" y2="80" stroke="{color}" stroke-width="1"/></svg>',
			),
			'arrows' => array(
				'name'        => __( 'Arrows', 'mase' ),
				'category'    => 'lines',
				'description' => __( 'Arrow pattern', 'mase' ),
				'svg'         => '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><polyline points="10,20 20,10 30,20" fill="none" stroke="{color}" stroke-width="2"/><line x1="20" y1="10" x2="20" y2="30" stroke="{color}" stroke-width="2"/></svg>',
			),
		),
		
		// Grids category (10+ patterns)
		'grids' => array(
			'square-grid' => array(
				'name'        => __( 'Square Grid', 'mase' ),
				'category'    => 'grids',
				'description' => __( 'Simple square grid', 'mase' ),
				'svg'         => '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="40" height="40" fill="none" stroke="{color}" stroke-width="1"/></svg>',
			),
			'small-grid' => array(
				'name'        => __( 'Small Grid', 'mase' ),
				'category'    => 'grids',
				'description' => __( 'Fine grid pattern', 'mase' ),
				'svg'         => '<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="20" height="20" fill="none" stroke="{color}" stroke-width="0.5"/></svg>',
			),
			'large-grid' => array(
				'name'        => __( 'Large Grid', 'mase' ),
				'category'    => 'grids',
				'description' => __( 'Large grid pattern', 'mase' ),
				'svg'         => '<svg width="80" height="80" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="80" height="80" fill="none" stroke="{color}" stroke-width="2"/></svg>',
			),
			'graph-paper' => array(
				'name'        => __( 'Graph Paper', 'mase' ),
				'category'    => 'grids',
				'description' => __( 'Graph paper grid', 'mase' ),
				'svg'         => '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="0" y2="40" stroke="{color}" stroke-width="0.5"/><line x1="10" y1="0" x2="10" y2="40" stroke="{color}" stroke-width="0.5"/><line x1="20" y1="0" x2="20" y2="40" stroke="{color}" stroke-width="1"/><line x1="30" y1="0" x2="30" y2="40" stroke="{color}" stroke-width="0.5"/><line x1="40" y1="0" x2="40" y2="40" stroke="{color}" stroke-width="0.5"/><line x1="0" y1="0" x2="40" y2="0" stroke="{color}" stroke-width="0.5"/><line x1="0" y1="10" x2="40" y2="10" stroke="{color}" stroke-width="0.5"/><line x1="0" y1="20" x2="40" y2="20" stroke="{color}" stroke-width="1"/><line x1="0" y1="30" x2="40" y2="30" stroke="{color}" stroke-width="0.5"/><line x1="0" y1="40" x2="40" y2="40" stroke="{color}" stroke-width="0.5"/></svg>',
			),
			'isometric-grid' => array(
				'name'        => __( 'Isometric Grid', 'mase' ),
				'category'    => 'grids',
				'description' => __( 'Isometric cube grid', 'mase' ),
				'svg'         => '<svg width="60" height="52" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="26" x2="30" y2="0" stroke="{color}" stroke-width="1"/><line x1="30" y1="0" x2="60" y2="26" stroke="{color}" stroke-width="1"/><line x1="0" y1="26" x2="30" y2="52" stroke="{color}" stroke-width="1"/><line x1="30" y1="52" x2="60" y2="26" stroke="{color}" stroke-width="1"/><line x1="30" y1="0" x2="30" y2="52" stroke="{color}" stroke-width="1"/></svg>',
			),
			'hexagon-grid' => array(
				'name'        => __( 'Hexagon Grid', 'mase' ),
				'category'    => 'grids',
				'description' => __( 'Hexagonal grid pattern', 'mase' ),
				'svg'         => '<svg width="56" height="48" xmlns="http://www.w3.org/2000/svg"><polygon points="28,0 42,8 42,24 28,32 14,24 14,8" fill="none" stroke="{color}" stroke-width="1"/></svg>',
			),
			'triangle-grid' => array(
				'name'        => __( 'Triangle Grid', 'mase' ),
				'category'    => 'grids',
				'description' => __( 'Triangular grid pattern', 'mase' ),
				'svg'         => '<svg width="40" height="35" xmlns="http://www.w3.org/2000/svg"><polygon points="20,0 40,35 0,35" fill="none" stroke="{color}" stroke-width="1"/></svg>',
			),
			'diamond-grid' => array(
				'name'        => __( 'Diamond Grid', 'mase' ),
				'category'    => 'grids',
				'description' => __( 'Diamond shaped grid', 'mase' ),
				'svg'         => '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><polygon points="20,0 40,20 20,40 0,20" fill="none" stroke="{color}" stroke-width="1"/></svg>',
			),
			'plus-grid' => array(
				'name'        => __( 'Plus Grid', 'mase' ),
				'category'    => 'grids',
				'description' => __( 'Plus sign grid', 'mase' ),
				'svg'         => '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><line x1="20" y1="0" x2="20" y2="40" stroke="{color}" stroke-width="2"/><line x1="0" y1="20" x2="40" y2="20" stroke="{color}" stroke-width="2"/></svg>',
			),
			'cross-grid' => array(
				'name'        => __( 'Cross Grid', 'mase' ),
				'category'    => 'grids',
				'description' => __( 'X-shaped cross grid', 'mase' ),
				'svg'         => '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="40" y2="40" stroke="{color}" stroke-width="2"/><line x1="40" y1="0" x2="0" y2="40" stroke="{color}" stroke-width="2"/></svg>',
			),
			'weave-grid' => array(
				'name'        => __( 'Weave Grid', 'mase' ),
				'category'    => 'grids',
				'description' => __( 'Woven basket pattern', 'mase' ),
				'svg'         => '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="20" height="10" fill="{color}"/><rect x="20" y="10" width="20" height="10" fill="{color}"/><rect x="0" y="20" width="20" height="10" fill="{color}"/><rect x="20" y="30" width="20" height="10" fill="{color}"/></svg>',
			),
		),
		
		// Organic category (20+ patterns)
		'organic' => array(
			'waves' => array(
				'name'        => __( 'Waves', 'mase' ),
				'category'    => 'organic',
				'description' => __( 'Ocean wave pattern', 'mase' ),
				'svg'         => '<svg width="100" height="40" xmlns="http://www.w3.org/2000/svg"><path d="M0,20 Q25,0 50,20 T100,20" fill="none" stroke="{color}" stroke-width="2"/></svg>',
			),
			'circles' => array(
				'name'        => __( 'Circles', 'mase' ),
				'category'    => 'organic',
				'description' => __( 'Overlapping circles', 'mase' ),
				'svg'         => '<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="20" fill="none" stroke="{color}" stroke-width="2"/></svg>',
			),
			'bubbles' => array(
				'name'        => __( 'Bubbles', 'mase' ),
				'category'    => 'organic',
				'description' => __( 'Floating bubbles', 'mase' ),
				'svg'         => '<svg width="80" height="80" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="10" fill="none" stroke="{color}" stroke-width="1"/><circle cx="50" cy="30" r="15" fill="none" stroke="{color}" stroke-width="1"/><circle cx="30" cy="60" r="8" fill="none" stroke="{color}" stroke-width="1"/></svg>',
			),
			'leaves' => array(
				'name'        => __( 'Leaves', 'mase' ),
				'category'    => 'organic',
				'description' => __( 'Leaf pattern', 'mase' ),
				'svg'         => '<svg width="40" height="60" xmlns="http://www.w3.org/2000/svg"><path d="M20,0 Q30,20 20,40 Q10,20 20,0" fill="none" stroke="{color}" stroke-width="2"/></svg>',
			),
			'flowers' => array(
				'name'        => __( 'Flowers', 'mase' ),
				'category'    => 'organic',
				'description' => __( 'Simple flower pattern', 'mase' ),
				'svg'         => '<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="5" fill="{color}"/><circle cx="30" cy="15" r="8" fill="none" stroke="{color}" stroke-width="2"/><circle cx="45" cy="30" r="8" fill="none" stroke="{color}" stroke-width="2"/><circle cx="30" cy="45" r="8" fill="none" stroke="{color}" stroke-width="2"/><circle cx="15" cy="30" r="8" fill="none" stroke="{color}" stroke-width="2"/></svg>',
			),
			'stars' => array(
				'name'        => __( 'Stars', 'mase' ),
				'category'    => 'organic',
				'description' => __( 'Star pattern', 'mase' ),
				'svg'         => '<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg"><polygon points="25,5 30,20 45,20 33,28 38,43 25,35 12,43 17,28 5,20 20,20" fill="none" stroke="{color}" stroke-width="2"/></svg>',
			),
			'hearts' => array(
				'name'        => __( 'Hearts', 'mase' ),
				'category'    => 'organic',
				'description' => __( 'Heart pattern', 'mase' ),
				'svg'         => '<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg"><path d="M25,40 C15,30 5,25 5,15 C5,5 15,5 25,15 C35,5 45,5 45,15 C45,25 35,30 25,40 Z" fill="none" stroke="{color}" stroke-width="2"/></svg>',
			),
			'clouds' => array(
				'name'        => __( 'Clouds', 'mase' ),
				'category'    => 'organic',
				'description' => __( 'Cloud pattern', 'mase' ),
				'svg'         => '<svg width="80" height="40" xmlns="http://www.w3.org/2000/svg"><ellipse cx="20" cy="25" rx="15" ry="10" fill="none" stroke="{color}" stroke-width="2"/><ellipse cx="40" cy="20" rx="20" ry="12" fill="none" stroke="{color}" stroke-width="2"/><ellipse cx="60" cy="25" rx="15" ry="10" fill="none" stroke="{color}" stroke-width="2"/></svg>',
			),
			'raindrops' => array(
				'name'        => __( 'Raindrops', 'mase' ),
				'category'    => 'organic',
				'description' => __( 'Falling raindrop pattern', 'mase' ),
				'svg'         => '<svg width="40" height="60" xmlns="http://www.w3.org/2000/svg"><path d="M20,10 L15,25 Q15,35 20,40 Q25,35 25,25 Z" fill="none" stroke="{color}" stroke-width="2"/></svg>',
			),
			'snowflakes' => array(
				'name'        => __( 'Snowflakes', 'mase' ),
				'category'    => 'organic',
				'description' => __( 'Snowflake pattern', 'mase' ),
				'svg'         => '<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg"><line x1="25" y1="5" x2="25" y2="45" stroke="{color}" stroke-width="2"/><line x1="5" y1="25" x2="45" y2="25" stroke="{color}" stroke-width="2"/><line x1="12" y1="12" x2="38" y2="38" stroke="{color}" stroke-width="2"/><line x1="38" y1="12" x2="12" y2="38" stroke="{color}" stroke-width="2"/></svg>',
			),
			'spirals' => array(
				'name'        => __( 'Spirals', 'mase' ),
				'category'    => 'organic',
				'description' => __( 'Spiral pattern', 'mase' ),
				'svg'         => '<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><path d="M30,30 Q35,25 35,20 Q35,15 30,15 Q25,15 25,20 Q25,25 30,25 Q35,25 35,30" fill="none" stroke="{color}" stroke-width="2"/></svg>',
			),
			'swirls' => array(
				'name'        => __( 'Swirls', 'mase' ),
				'category'    => 'organic',
				'description' => __( 'Decorative swirl pattern', 'mase' ),
				'svg'         => '<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><path d="M10,30 Q20,10 40,20 Q60,30 50,50" fill="none" stroke="{color}" stroke-width="2"/></svg>',
			),
			'vines' => array(
				'name'        => __( 'Vines', 'mase' ),
				'category'    => 'organic',
				'description' => __( 'Vine and tendril pattern', 'mase' ),
				'svg'         => '<svg width="40" height="80" xmlns="http://www.w3.org/2000/svg"><path d="M20,0 Q10,20 20,40 Q30,60 20,80" fill="none" stroke="{color}" stroke-width="2"/><circle cx="15" cy="20" r="3" fill="{color}"/><circle cx="25" cy="60" r="3" fill="{color}"/></svg>',
			),
			'feathers' => array(
				'name'        => __( 'Feathers', 'mase' ),
				'category'    => 'organic',
				'description' => __( 'Feather pattern', 'mase' ),
				'svg'         => '<svg width="30" height="80" xmlns="http://www.w3.org/2000/svg"><path d="M15,0 L15,80" stroke="{color}" stroke-width="2"/><path d="M15,10 Q5,15 15,20" fill="none" stroke="{color}" stroke-width="1"/><path d="M15,30 Q25,35 15,40" fill="none" stroke="{color}" stroke-width="1"/><path d="M15,50 Q5,55 15,60" fill="none" stroke="{color}" stroke-width="1"/></svg>',
			),
			'scales' => array(
				'name'        => __( 'Scales', 'mase' ),
				'category'    => 'organic',
				'description' => __( 'Fish scale pattern', 'mase' ),
				'svg'         => '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><path d="M0,20 Q20,0 40,20" fill="none" stroke="{color}" stroke-width="2"/><path d="M0,40 Q20,20 40,40" fill="none" stroke="{color}" stroke-width="2"/></svg>',
			),
			'shells' => array(
				'name'        => __( 'Shells', 'mase' ),
				'category'    => 'organic',
				'description' => __( 'Seashell pattern', 'mase' ),
				'svg'         => '<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg"><path d="M25,5 Q15,15 15,25 Q15,35 25,45 Q35,35 35,25 Q35,15 25,5" fill="none" stroke="{color}" stroke-width="2"/><line x1="25" y1="5" x2="25" y2="45" stroke="{color}" stroke-width="1"/></svg>',
			),
			'butterflies' => array(
				'name'        => __( 'Butterflies', 'mase' ),
				'category'    => 'organic',
				'description' => __( 'Butterfly pattern', 'mase' ),
				'svg'         => '<svg width="60" height="40" xmlns="http://www.w3.org/2000/svg"><ellipse cx="15" cy="15" rx="10" ry="12" fill="none" stroke="{color}" stroke-width="2"/><ellipse cx="45" cy="15" rx="10" ry="12" fill="none" stroke="{color}" stroke-width="2"/><ellipse cx="15" cy="25" rx="8" ry="10" fill="none" stroke="{color}" stroke-width="2"/><ellipse cx="45" cy="25" rx="8" ry="10" fill="none" stroke="{color}" stroke-width="2"/><line x1="30" y1="10" x2="30" y2="30" stroke="{color}" stroke-width="2"/></svg>',
			),
			'paisley' => array(
				'name'        => __( 'Paisley', 'mase' ),
				'category'    => 'organic',
				'description' => __( 'Paisley teardrop pattern', 'mase' ),
				'svg'         => '<svg width="40" height="60" xmlns="http://www.w3.org/2000/svg"><path d="M20,10 Q30,20 30,35 Q30,50 20,55 Q10,50 10,35 Q10,20 20,10" fill="none" stroke="{color}" stroke-width="2"/><circle cx="20" cy="30" r="5" fill="none" stroke="{color}" stroke-width="1"/></svg>',
			),
			'moroccan' => array(
				'name'        => __( 'Moroccan', 'mase' ),
				'category'    => 'organic',
				'description' => __( 'Moroccan tile pattern', 'mase' ),
				'svg'         => '<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><path d="M30,0 Q45,15 30,30 Q15,15 30,0 M30,30 Q45,45 30,60 Q15,45 30,30 M0,30 Q15,15 30,30 Q15,45 0,30 M30,30 Q45,15 60,30 Q45,45 30,30" fill="none" stroke="{color}" stroke-width="2"/></svg>',
			),
			'arabesque' => array(
				'name'        => __( 'Arabesque', 'mase' ),
				'category'    => 'organic',
				'description' => __( 'Arabesque ornamental pattern', 'mase' ),
				'svg'         => '<svg width="80" height="80" xmlns="http://www.w3.org/2000/svg"><path d="M40,10 Q60,20 60,40 Q60,60 40,70 Q20,60 20,40 Q20,20 40,10" fill="none" stroke="{color}" stroke-width="2"/><path d="M40,30 Q50,35 50,45 Q50,55 40,60 Q30,55 30,45 Q30,35 40,30" fill="none" stroke="{color}" stroke-width="1"/></svg>',
			),
		),
	);

	/**
	 * Filter pattern library.
	 *
	 * Allows developers to add, remove, or modify SVG patterns.
	 *
	 * @since 1.2.0
	 * @param array $patterns Pattern library organized by category.
	 */
	return apply_filters( 'mase_pattern_library', $patterns );
}
