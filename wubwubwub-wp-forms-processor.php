<?php
if ( ! defined( 'WPINC' ) ) { die('Direct access prohibited!'); }
/**
 * Plugin Name: WubWubWub WP Forms Processor
 * Plugin URI: https://github.com/wubbywubwubwub/wubwubwub-wp-forms-processor
 * Description: A form processor plugin for WordPress.
 * Author: Wub Wub Wub
 * Version: 20220714.1
 * Author URI: https://wubwubwub.com
 */

/**
 * Plugin activation functions
 */
function wubwubwub_wp_form_processor_activate()
{
   require_once( plugin_dir_path( __FILE__ ) . 'activation/db.php' );
}
register_activation_hook( __FILE__, 'wubwubwub_wp_form_processor_activate' );

/**
 * Admin views
 */
require_once( plugin_dir_path( __FILE__ ) . 'admin/admin.php' );

/**
 * Endpoints
 */
require_once( plugin_dir_path( __FILE__ ) . 'endpoints/endpoints.php' );
