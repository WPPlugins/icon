<?php

if ( ! defined( 'ABSPATH' ) ) {
	die( 'Please do not load this file directly!' );
}

//include the tinymce javascript plugin
function icon_tinymce_plugin_core( $plugin_array ) {
	
	$plugin_array['wpicons'] = ICON_URL.'/inc/admin/tinymce-plugin/wpicons/editor_plugin.js';
	return $plugin_array;
	
}

//include the css file to style the graphic that replaces the shortcode
function icon_tinymce_plugin_style( $in ) {
	
	$in['content_css'] .= ",".ICON_URL.'/inc/admin/tinymce-plugin/wpicons/custom-editor-style.css';
	return $in;
	
}

function override_mce_options( $initArray ) {
	$opts = '*[*]';
	$initArray['valid_elements'] = $opts;
	$initArray['extended_valid_elements'] = $opts;
	return $initArray;
	
}

add_filter( 'mce_external_plugins', 'icon_tinymce_plugin_core' );
add_filter( 'tiny_mce_before_init', 'icon_tinymce_plugin_style' );
//add_filter( 'tiny_mce_before_init', 'override_mce_options' );