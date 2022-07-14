<?php
if ( ! defined( 'WPINC' ) ) { die('Direct access prohibited!'); }

// Enqueue additional JavaScript and CSS
function wubwubwub_wp_forms_edit_scripts( $hook )
{

	if( 'forms_page_wubwubwub_wp_forms_edit' != $hook )
	{
		return;
	}

    wp_register_style( 'wubwubwub_wp_forms_edit_css', plugin_dir_url( __FILE__ ) . 'css/wubwubwub_wp_forms_edit.css', array(), '0.0.1', 'all' );
	wp_enqueue_style( 'wubwubwub_wp_forms_edit_css' );

	wp_register_script( 'wubwubwub_wp_forms_edit_js', plugin_dir_url( __FILE__ ) . 'js/wubwubwub_wp_forms_edit.js', array('jquery'), '0.0.1', true );
	wp_enqueue_script( 'wubwubwub_wp_forms_edit_js' );

	wp_enqueue_media();
}
add_action( 'admin_enqueue_scripts', 'wubwubwub_wp_forms_edit_scripts' );

// HTML output
function wubwubwub_wp_forms_edit_callback()
{
	?>
	<div class="wrap">

		<input type="hidden" id="wubwubwub-wp-nonce" value="<?php echo wp_create_nonce( "wp_rest" ) ?>">

		<h1>Forms: <span id="action">Edit</span></h1>

		<p>Use the form below to edit this form's attributes.</p>

		<div id="wubwubwub-wp-forms-save-notify" class="wubwubwub-wp-forms-save-notify"></div>

		<div id="wubwubwub-wp-forms-panel" class="wubwubwub-wp-forms-panel">
			<table class="form-table">
				<tbody>
                    <tr>
						<th scope="row">Form name</th>
						<td>
							<input data-form="<?php echo $_GET['form']; ?>" type="text" class="regular-text wubwubwub-wp-forms-input wubwubwub-wp-forms-name" id="wubwubwub-wp-forms-name" spellcheck="true" autocomplete="off" data-endpoint="<?php echo site_url('wp-json/wubwubwub_wp_forms/forms_admin') ?>">
						</td>
					</tr>

                    <tr>
						<th scope="row">Required fields</th>
						<td>
							<input type="text" class="regular-text wubwubwub-wp-forms-required-field-input" value="" id="wubwubwub-wp-forms-required-field-input" autocomplete="off">
                            <button id="wubwubwub-wp-forms-add-required-field-button" class="button wubwubwub-wp-forms-add-required-field-button">Add</button>
                            <p class="description">Add the names of any required fields.</p>
                            <ul id="required-fields-list" class="required-fields-list wubwubwub-wp-forms-list"></ul>
						</td>
					</tr>

                    <tr>
						<th scope="row">Recipients (to:)</th>
						<td>
							<input type="text" class="regular-text wubwubwub-wp-forms-to-recipients-input" value="" id="wubwubwub-wp-forms-to-recipients-input" autocomplete="off">
                            <button id="wubwubwub-wp-forms-add-to-recipients-button" class="button wubwubwub-wp-forms-add-to-recipients-button">Add</button>
                            <p class="description">Email addresses to send results to.</p>
                            <ul id="to-recipients-list" class="to-recipients-list wubwubwub-wp-forms-list"></ul>
						</td>
					</tr>

                    <tr>
						<th scope="row">Recipients (cc:)</th>
						<td>
							<input type="text" class="regular-text wubwubwub-wp-forms-cc-recipients-input" value="" id="wubwubwub-wp-forms-cc-recipients-input" autocomplete="off">
                            <button id="wubwubwub-wp-forms-add-cc-recipients-button" class="button wubwubwub-wp-forms-add-cc-recipients-button">Add</button>
                            <p class="description">Email addresses to CC results to.</p>
                            <ul id="cc-recipients-list" class="cc-recipients-list wubwubwub-wp-forms-list"></ul>
						</td>
					</tr>

                    <tr>
						<th scope="row">Recipients (bcc:)</th>
						<td>
							<input type="text" class="regular-text wubwubwub-wp-forms-bcc-recipients-input" value="" id="wubwubwub-wp-forms-bcc-recipients-input" autocomplete="off">
                            <button id="wubwubwub-wp-forms-add-bcc-recipients-button" class="button wubwubwub-wp-forms-add-bcc-recipients-button">Add</button>
                            <p class="description">Email addresses to BCC results to.</p>
                            <ul id="bcc-recipients-list" class="bcc-recipients-list wubwubwub-wp-forms-list"></ul>
						</td>
					</tr>

				</tbody>
			</table>

			<p>
				<button id="wubwubwub-wp-forms-save-form" class="button button-primary button-large" disabled="disabled">Save Form</button>
			</p>

		</div>

	</div>
	<?php
}
