<?php
/**
 * Plugin Name:       Style Tiles
 * Description:       Gutenberg block plugin for rendering premium style tiles with design tokens.
 * Requires at least: 6.4
 * Requires PHP:      7.4
 * Version:           1.0.0
 * Author:            MZV
 * License:           MIT
 * License URI:       https://opensource.org/licenses/MIT
 * Text Domain:       style-tiles
 *
 * @package MZVStyleTiles
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registers design category for block editor.
 *
 * @param array   $categories Existing categories.
 * @param WP_Post $post Current post.
 * @return array
 */
function mzv_style_tiles_register_design_category( $categories, $post ) {
	foreach ( $categories as $category ) {
		if ( isset( $category['slug'] ) && 'design' === $category['slug'] ) {
			return $categories;
		}
	}

	$categories[] = array(
		'slug'  => 'design',
		'title' => __( 'Design', 'style-tiles' ),
	);

	return $categories;
}
add_filter( 'block_categories_all', 'mzv_style_tiles_register_design_category', 10, 2 );

/**
 * Registers the style tile block.
 */
function mzv_style_tiles_register_block() {
	register_block_type( __DIR__ );
}
add_action( 'init', 'mzv_style_tiles_register_block' );

/**
 * Detect theme framework by stylesheet slug and parent.
 *
 * @return string
 */
function mzv_style_tiles_detect_framework() {
	$theme = wp_get_theme();
	$slug  = strtolower( (string) $theme->get_stylesheet() );
	$name  = strtolower( (string) $theme->get( 'Name' ) );
	$parent = strtolower( (string) $theme->get_template() );
	$needle = $slug . ' ' . $name . ' ' . $parent;

	if ( false !== strpos( $needle, 'kadence' ) ) {
		return 'kadence';
	}

	if ( false !== strpos( $needle, 'generatepress' ) || false !== strpos( $needle, 'generate press' ) ) {
		return 'generatepress';
	}

	return 'core';
}

/**
 * Build Google Fonts URL from unique font names.
 *
 * @param array $fonts Font family list.
 * @return string
 */
function mzv_style_tiles_build_google_fonts_url( $fonts ) {
	$system_fonts = array(
		'Arial',
		'Helvetica',
		'Georgia',
		'Times New Roman',
		'Trebuchet MS',
		'Verdana',
		'Tahoma',
		'Courier New',
		'sans-serif',
		'serif',
		'monospace',
		'system-ui',
	);

	$families = array();
	foreach ( $fonts as $font ) {
		$font = trim( (string) $font );
		if ( '' === $font || in_array( $font, $system_fonts, true ) ) {
			continue;
		}
		$families[] = str_replace( ' ', '+', $font ) . ':wght@300;400;500;600;700;800';
	}

	$families = array_unique( $families );
	if ( empty( $families ) ) {
		return '';
	}

	return add_query_arg(
		array(
			'family'  => implode( '&family=', $families ),
			'display' => 'swap',
		),
		'https://fonts.googleapis.com/css2'
	);
}

/**
 * Inject framework label and enqueue Google fonts from block attrs.
 *
 * @param string $block_content Content.
 * @param array  $block Parsed block.
 * @return string
 */
function mzv_style_tiles_render_block_filter( $block_content, $block ) {
	if ( empty( $block['blockName'] ) || 'mzv/style-tile' !== $block['blockName'] ) {
		return $block_content;
	}

	$framework = mzv_style_tiles_detect_framework();
	$label_map = array(
		'core'          => 'WordPress Core',
		'kadence'       => 'Kadence',
		'generatepress' => 'GeneratePress',
	);

	$label = isset( $label_map[ $framework ] ) ? $label_map[ $framework ] : 'WordPress Core';

	if ( false !== strpos( $block_content, '__MZV_THEME_FRAMEWORK__' ) ) {
		$block_content = str_replace( '__MZV_THEME_FRAMEWORK__', esc_html( $label ), $block_content );
	}

	if ( preg_match( '/class="([^"]*mzv-style-tile[^"]*)"/', $block_content, $matches ) ) {
		$current = $matches[1];
		$updated = trim( $current . ' is-framework-' . sanitize_html_class( $framework ) );
		$block_content = preg_replace( '/class="([^"]*mzv-style-tile[^"]*)"/', 'class="' . $updated . '"', $block_content, 1 );
	}

	$attrs = isset( $block['attrs'] ) && is_array( $block['attrs'] ) ? $block['attrs'] : array();
	$fonts = array();
	if ( isset( $attrs['headingFont'] ) ) {
		$fonts[] = $attrs['headingFont'];
	}
	if ( isset( $attrs['bodyFont'] ) ) {
		$fonts[] = $attrs['bodyFont'];
	}

	$font_url = mzv_style_tiles_build_google_fonts_url( $fonts );
	if ( '' !== $font_url ) {
		wp_enqueue_style( 'mzv-style-tiles-google-fonts', esc_url_raw( $font_url ), array(), null );
	}

	return $block_content;
}
add_filter( 'render_block', 'mzv_style_tiles_render_block_filter', 10, 2 );
