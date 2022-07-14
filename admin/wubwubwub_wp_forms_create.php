<?php
if ( ! defined( 'WPINC' ) ) { die('Direct access prohibited!'); }

// Enqueue additional JavaScript and CSS
function wubwubwub_wp_forms_create_scripts( $hook )
{

	if( 'forms_page_wubwubwub_wp_forms_create' != $hook )
	{
		return;
	}

	wp_register_style( 'wubwubwub_wp_forms_create_css', plugin_dir_url( __FILE__ ) . 'css/wubwubwub_wp_forms_create.css', array(), '0.0.1', 'all' );
	wp_enqueue_style( 'wubwubwub_wp_forms_create_css' );

	wp_register_script( 'wubwubwub_wp_forms_create_js', plugin_dir_url( __FILE__ ) . 'js/wubwubwub_wp_forms_create.js', array('jquery'), '0.0.1', true );
	wp_enqueue_script( 'wubwubwub_wp_forms_create_js' );

}
add_action( 'admin_enqueue_scripts', 'wubwubwub_wp_forms_create_scripts' );


// Output HTML
function wubwubwub_wp_forms_create_callback()
{
	?>
	<div class="wrap">

		<input type="hidden" id="wubwubwub-wp-nonce" value="<?php echo wp_create_nonce( "wp_rest" ) ?>">

		<h1>Forms: <span id="action">Add New</span></h1>

		<div id="wubwubwub-wp-notify"></div>

		<p>Give your form a name and click "create".</p>

		<form id="create-form-form" class="create-form-form" action="index.html" method="post" data-endpoint="<?php echo site_url('wp-json/wubwubwub_wp_forms/forms_admin') ?>">
				<table class="form-table">
					<tbody>
						<tr>
							<th scope="row">Name</th>
							<td>
								<input id="form_name" type="text" class="regular-text" name="form_name" value="" placeholder="My form ...">
							</td>
						</tr>
					</tbody>
				</table>
				<p class="submit">
					<input type="submit" name="submit" id="submit" class="button button-primary" value="Create">
				</p>
		</form>

	</div>
	<?php
}
