<?php
if ( ! defined( 'WPINC' ) ) { die('Direct access prohibited!'); }
// Register the endpoints
function wubwubwub_wp_forms_register_endpoints()
{
    // endpoint:/wp-json/wubwubwub_wp_forms/forms_admin
    register_rest_route( 'wubwubwub_wp_forms', '/forms_admin', array(
        'methods' => 'GET',
        'callback' => 'wubwubwub_wp_forms_admin',
        'show_in_index' => false,
        'permission_callback' => function () {
            return current_user_can( 'edit_pages' );
        }
    ));

    // endpoint:/wp-json/wubwubwub_wp_forms/processor
    register_rest_route( 'wubwubwub_wp_forms', '/processor', array(
        'methods' => 'POST',
        'callback' => 'wubwubwub_wp_forms_processor',
        'show_in_index' => false,
        'permission_callback' => '__return_true',
    ));
}
add_action( 'rest_api_init', 'wubwubwub_wp_forms_register_endpoints' );

// Include endpoints for the above registrations
require_once( plugin_dir_path( __FILE__ ) . 'forms_admin.php' );
require_once( plugin_dir_path( __FILE__ ) . 'processor.php' );
