jQuery(document).ready(function($){

    // Get wp nonce for authentication and set-up ajax
    $.ajaxSetup({
        beforeSend: function(xhr) {
            xhr.setRequestHeader( 'X-WP-Nonce', $( '#wubwubwub-wp-nonce' ).val() );
        }
    });

    // Test for form
    var endpoint = $( '#wubwubwub-wp-forms-name' ).data( 'endpoint' );
    var data = {
        action: 'get_form',
        form: $( '#wubwubwub-wp-forms-name' ).data( 'form' )
    };

    $.ajax({
        url: endpoint,
        type: 'GET',
        dataType: 'json',
        data: data
    })
    .done(function( data ) {
        if( data.error )
        {
            window.location.href = "admin.php?page=wubwubwub_wp_forms";
        }
        else
        {
            $( '.wubwubwub-wp-forms-field-form' ).html( data.form.form );
            $( '#wubwubwub-wp-forms-field-required' ).html( 'none' );
            if( data.form.required_fields != '[]' )
            {
                var li = '<ul class="wubwubwub-wp-forms-required-fields-list">';
                var desc = '<p class="description">';
                desc += 'Required field(s) within your AJAX payload. E.g.<br>{';
                var required_fields = JSON.parse( data.form.required_fields );
                $.each(required_fields, function( key, val )
                {
                    li += '<li><code>' + val + '</code></li>';
                    desc += val + ": 'value', ";
                });
                li += '</ul>';
                desc += ' ... }</p>';
                $( '#wubwubwub-wp-forms-field-required' ).html( li + desc )
            }
        }
    })
    .fail(function( data ) {
        console.log( "error" );
    });

});
