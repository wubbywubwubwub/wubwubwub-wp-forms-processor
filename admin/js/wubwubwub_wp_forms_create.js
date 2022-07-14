jQuery(document).ready(function($){

    // Get wp nonce for authentication and set-up ajax
    $.ajaxSetup({
        beforeSend: function(xhr) {
            xhr.setRequestHeader( 'X-WP-Nonce', $( '#wubwubwub-wp-nonce' ).val() );
        }
    });

    $( '#form_name' ).focus();

    $( document ).on( 'submit', '#create-form-form', function( e )
	{
		e.preventDefault();

        $( '#create-form-notify' ).html('');
        $( '#create-form-form #submit' ).attr( 'disabled', 'disabled' );

		var name = $( '#form_name' ).val().trim();
        $( '#form_name' ).val( name );
        var endpoint = $( '#create-form-form' ).data( 'endpoint' );
		var data = {
			action: 'create_form',
            name: name
        };
        
        $.ajax(
		{
			url: endpoint,
			type: 'GET',
			dataType: 'json',
			data: data
		})
		.done(function( data )
		{
            if( data.error)
            {
                $( '#wubwubwub-wp-notify' ).html( '<div class="notice notice-error is-dismissible"><p>Error: ' + data.error + '</p></div>' );
                $( '#create-form-form #submit' ).removeAttr( 'disabled' );
            }
            else
            {
                window.location.href = "admin.php?page=wubwubwub_wp_forms_edit&form=" + data.id;
            }
		})
		.fail(function()
		{
			console.log("OH NOES! AJAX error");
		});

	});

});
