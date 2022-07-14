jQuery(document).ready(function($){

    /**
     * Test for valid email
     * See: http://stackoverflow.com/posts/46181/revisions
     */
    function validateEmail( email )
    {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }


    // Test for form
    var endpoint = $( '#wubwubwub-wp-forms-name' ).data( 'endpoint' );
    var data = {
        action: 'get_form',
        form: $( '#wubwubwub-wp-forms-name' ).data( 'form' )
    };
    // Get wp nonce for authentication and set-up ajax
    $.ajaxSetup({
        beforeSend: function(xhr) {
            xhr.setRequestHeader( 'X-WP-Nonce', $( '#wubwubwub-wp-nonce' ).val() );
        }
    });
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
            $( '#wubwubwub-wp-forms-name' ).val( data.form.name );

            if( data.form.required_fields !== '' )
            {
                var required_fields = JSON.parse( data.form.required_fields );
                $.each(required_fields, function( key, val )
                {
                    $( '#required-fields-list' ).append( '<li data-value="' + val + '"><span class="wubwubwub-wp-forms-li-del-button" tabindex="0">X</span> ' + val + '</li> ' );
                });
            }

            if( data.form.to_recipients !== '' )
            {
                var to_recipients = JSON.parse( data.form.to_recipients );
                $.each(to_recipients, function( key, val )
                {
                    $( '#to-recipients-list' ).append( '<li data-value="' + val + '"><span class="wubwubwub-wp-forms-li-del-button" tabindex="0">X</span> ' + val + '</li> ' );
                });
            }

            if( data.form.cc_recipients !== '' )
            {
                var cc_recipients = JSON.parse( data.form.cc_recipients );
                $.each(cc_recipients, function( key, val )
                {
                    $( '#cc-recipients-list' ).append( '<li data-value="' + val + '"><span class="wubwubwub-wp-forms-li-del-button" tabindex="0">X</span> ' + val + '</li> ' );
                });
            }

            if( data.form.bcc_recipients !== '' )
            {
                var bcc_recipients = JSON.parse( data.form.bcc_recipients );
                $.each(bcc_recipients, function( key, val )
                {
                    $( '#bcc-recipients-list' ).append( '<li data-value="' + val + '"><span class="wubwubwub-wp-forms-li-del-button" tabindex="0">X</span> ' + val + '</li> ' );
                });
            }
        }
    })
    .fail(function( data ) {
        console.log( "error" );
    });

    // Remove list item
    $( document ).on('click', '.wubwubwub-wp-forms-li-del-button', function( e )
    {
        e.preventDefault();
        $(this).parents("li:first").remove();
        $( '#wubwubwub-wp-forms-save-form' ).removeAttr( 'disabled' );
        $( '#wubwubwub-wp-forms-save-notify' ).html( '' );
    });

    $( document ).on( 'change keyup', '.wubwubwub-wp-forms-input', function()
    {
        $( '#wubwubwub-wp-forms-save-form' ).removeAttr( 'disabled' );
        $( '#wubwubwub-wp-forms-save-notify' ).html( '' );
    });

    // Add required field list item
    $( document ).on( 'click', '#wubwubwub-wp-forms-add-required-field-button', function( e )
    {
        e.preventDefault();
        do_tags();
    });

    $( document ).on( 'keyup', '#wubwubwub-wp-forms-required-field-input', function( e )
    {
        e.preventDefault();
        if (e.keyCode == 13)
        {
            do_tags();
        }
    });

    function do_tags()
    {
        var str = $( '#wubwubwub-wp-forms-required-field-input' ).val().trim().toLowerCase();

        var strs = str.split( ',' );

        $.each( strs, function( i, str )
        {
            str = str.trim();
            str = str.replace( /[^0-9a-z_]/gi, '' );

            if( str === '' )
            {
                $( '#wubwubwub-wp-forms-required-field-input' ).val( '' );
                $( '#wubwubwub-wp-forms-required-field-input' ).focus();
                return;
            }

            var dup = false;
            $( '#required-fields-list li' ).each(function( i )
            {
                test = $( this ).data( 'value' );
                if( test === str )
                {
                    dup = true;
                }
            });

            if( dup === false )
            {
                $( '#required-fields-list' ).append( '<li data-value="' + str + '"><span class="wubwubwub-wp-forms-li-del-button" tabindex="0">X</span> ' + str + '</li> ' );
                $( '#wubwubwub-wp-forms-save-form' ).removeAttr( 'disabled' );
                $( '#wubwubwub-wp-forms-save-notify' ).html( '' );
            }
        });

        $( '#wubwubwub-wp-forms-required-field-input' ).val( '' );
        $( '#wubwubwub-wp-forms-required-field-input' ).focus();
    }

    // Add to_recipients
    $( document ).on('click', '#wubwubwub-wp-forms-add-to-recipients-button', function( e )
    {
        e.preventDefault();
        do_recipients();
    });

    $( document ).on( 'keyup', '#wubwubwub-wp-forms-to-recipients-input', function( e )
    {
        e.preventDefault();
        if (e.keyCode == 13)
        {
            do_recipients();
        }
    });

    function do_recipients()
    {
        var emails = $( '#wubwubwub-wp-forms-to-recipients-input' ).val().trim();

        var emails = emails.split( ',' );

        $.each( emails, function( i, email )
        {

            email = email.trim();

            if( email === '' || validateEmail(email) === false )
            {
                $( '#wubwubwub-wp-forms-to-recipients-input' ).val( '' );
                $( '#wubwubwub-wp-forms-to-recipients-input' ).focus();
                return;
            }

            var dup = false;
            $( '#to-recipients-list li' ).each(function( i )
            {
                test = $( this ).data( 'value' );
                if( test === email )
                {
                    dup = true;
                }
            });

            if( dup === false )
            {
                $( '#to-recipients-list' ).append( '<li data-value="' + email + '"><span class="wubwubwub-wp-forms-li-del-button" tabindex="0">X</span> ' + email + '</li> ' );
                $( '#wubwubwub-wp-forms-save-form' ).removeAttr( 'disabled' );
                $( '#wubwubwub-wp-forms-save-notify' ).html( '' );
            }
        });

        $( '#wubwubwub-wp-forms-to-recipients-input' ).val( '' );
        $( '#wubwubwub-wp-forms-to-recipients-input' ).focus();
    }

    // Add cc_recipients
    $( document ).on('click', '#wubwubwub-wp-forms-add-cc-recipients-button', function( e )
    {
        e.preventDefault();
        do_cc_recipients();
    });

    $( document ).on( 'keyup', '#wubwubwub-wp-forms-cc-recipients-input', function( e )
    {
        e.preventDefault();
        if (e.keyCode == 13)
        {
            do_cc_recipients();
        }
    });

    function do_cc_recipients()
    {
        var emails = $( '#wubwubwub-wp-forms-cc-recipients-input' ).val().trim();

        var emails = emails.split( ',' );

        $.each( emails, function( i, email )
        {

            email = email.trim();

            if( email === '' || validateEmail(email) === false )
            {
                $( '#wubwubwub-wp-forms-cc-recipients-input' ).val( '' );
                $( '#wubwubwub-wp-forms-cc-recipients-input' ).focus();
                return;
            }

            var dup = false;
            $( '#cc-recipients-list li' ).each(function( i )
            {
                test = $( this ).data( 'value' );
                if( test === email )
                {
                    dup = true;
                }
            });

            if( dup === false )
            {
                $( '#cc-recipients-list' ).append( '<li data-value="' + email + '"><span class="wubwubwub-wp-forms-li-del-button" tabindex="0">X</span> ' + email + '</li> ' );
                $( '#wubwubwub-wp-forms-save-form' ).removeAttr( 'disabled' );
                $( '#wubwubwub-wp-forms-save-notify' ).html( '' );
            }
        });

        $( '#wubwubwub-wp-forms-cc-recipients-input' ).val( '' );
        $( '#wubwubwub-wp-forms-cc-recipients-input' ).focus();
    }

    // Add bcc_recipients
    $( document ).on('click', '#wubwubwub-wp-forms-add-bcc-recipients-button', function( e )
    {
        e.preventDefault();
        do_bcc_recipients();
    });

    $( document ).on( 'keyup', '#wubwubwub-wp-forms-bcc-recipients-input', function( e )
    {
        e.preventDefault();
        if (e.keyCode == 13)
        {
            do_bcc_recipients();
        }
    });

    function do_bcc_recipients()
    {
        var emails = $( '#wubwubwub-wp-forms-bcc-recipients-input' ).val().trim();

        var emails = emails.split( ',' );

        $.each( emails, function( i, email )
        {

            email = email.trim();

            if( email === '' || validateEmail(email) === false )
            {
                $( '#wubwubwub-wp-forms-bcc-recipients-input' ).val( '' );
                $( '#wubwubwub-wp-forms-bcc-recipients-input' ).focus();
                return;
            }

            var dup = false;
            $( '#bcc-recipients-list li' ).each(function( i )
            {
                test = $( this ).data( 'value' );
                if( test === email )
                {
                    dup = true;
                }
            });

            if( dup === false )
            {
                $( '#bcc-recipients-list' ).append( '<li data-value="' + email + '"><span class="wubwubwub-wp-forms-li-del-button" tabindex="0">X</span> ' + email + '</li> ' );
                $( '#wubwubwub-wp-forms-save-form' ).removeAttr( 'disabled' );
                $( '#wubwubwub-wp-forms-save-notify' ).html( '' );
            }
        });

        $( '#wubwubwub-wp-forms-bcc-recipients-input' ).val( '' );
        $( '#wubwubwub-wp-forms-bcc-recipients-input' ).focus();
    }

    // Save form    
    $( document ).on( 'click', '#wubwubwub-wp-forms-save-form', function( e )
    {
        e.preventDefault();

        $( this ).attr( 'disabled', 'disabled' );
        $( this ).html( '<span class="wubwubwub_wp_forms_saving"><img src="/wp-includes/images/spinner.gif"> saving ...</span>' );
        $( this ).removeClass( 'button-primary' );

        var id = $( '#wubwubwub-wp-forms-name' ).data( 'form' );
        var name = $( '#wubwubwub-wp-forms-name' ).val().trim();

        var required_fields = [];
        $( '#required-fields-list li' ).each(function( i )
        {
            required_fields.push( $( this ).data( 'value' ) );
        });
        required_fields = JSON.stringify( required_fields );

        var to_recipients = [];
        $( '#to-recipients-list li' ).each(function( i )
        {
            to_recipients.push( $( this ).data( 'value' ) );
        });
        to_recipients = JSON.stringify( to_recipients );

        var cc_recipients = [];
        $( '#cc-recipients-list li' ).each(function( i )
        {
            cc_recipients.push( $( this ).data( 'value' ) );
        });
        cc_recipients = JSON.stringify( cc_recipients );

        var bcc_recipients = [];
        $( '#bcc-recipients-list li' ).each(function( i )
        {
            bcc_recipients.push( $( this ).data( 'value' ) );
        });
        bcc_recipients = JSON.stringify( bcc_recipients );

        var data = {
            action: 'save_form',
            id: id,
            name: name,
            required_fields: required_fields,
            to_recipients: to_recipients,
            cc_recipients: cc_recipients,
            bcc_recipients: bcc_recipients
        };
        // Get wp nonce for authentication and set-up ajax
        $.ajaxSetup({
            beforeSend: function(xhr) {
                xhr.setRequestHeader( 'X-WP-Nonce', $( '#wubwubwub-wp-nonce' ).val() );
            }
        });
        $.ajax({
            url: endpoint,
            type: 'GET',
            dataType: 'json',
            data: data
        })
        .done(function( data ) {
            $( '#wubwubwub-wp-forms-name' ).val( data.name );
            $( '#wubwubwub-wp-forms-save-form' ).addClass( 'button-primary' );
            $( '#wubwubwub-wp-forms-save-form' ).html( 'Save Form' );
            var notify = '<div id="message" class="updated notice notice-success is-dismissible"><p>Form saved.</p></div>';
            $( '#wubwubwub-wp-forms-save-notify' ).html( notify );
        })
        .fail(function() {
            console.log("error");
        });

    });

});
