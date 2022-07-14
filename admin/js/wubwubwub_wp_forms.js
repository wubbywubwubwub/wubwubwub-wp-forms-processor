jQuery(document).ready(function($)
{
    
    // Get wp nonce for authentication and set-up ajax
    $.ajaxSetup({
        beforeSend: function(xhr) {
            xhr.setRequestHeader( 'X-WP-Nonce', $( '#wubwubwub-wp-nonce' ).val() );
        }
    });

    // List forms
    function get_forms()
    {
        $( '.tablenav-pages-navspan' ).attr('disabled', 'disabled');
        var endpoint = $( '#wubwubwub-wp-forms' ).data( 'endpoint' );
        var data = {
            action: 'list_forms',
            offset: $( '#wubwubwub-wp-forms' ).data( 'offset' ),
            limit: $( '#wubwubwub-wp-forms' ).data( 'limit' )
        };

        $.ajax({
            url: endpoint,
            type: 'GET',
            dataType: 'json',
            data: data
        })
        .done(function( data ) {
            var forms = '';
            var items = data.total;

            // Paging
            $( '.displaying-num' ).html( items + ' items' );
            if( data.num_rows === 0 && data.total > 0 )
            {
                var offset = $( '#wubwubwub-wp-forms' ).data( 'offset' );
                var limit = $( '#wubwubwub-wp-forms' ).data( 'limit' );
                offset = offset - limit;
                $( '#wubwubwub-wp-forms' ).data( 'offset', offset );
                get_forms();
                return;
            }
            if( items > 0 )
            {
                var limit = $( '#wubwubwub-wp-forms' ).data( 'limit' );
                var pages = Math.ceil( items / limit );
                $( '#wubwubwub-wp-forms' ).data( 'pages', pages );
                $( '#wubwubwub-wp-forms' ).data( 'total', items );
                var offset = $( '#wubwubwub-wp-forms' ).data( 'offset' );
                var page = (offset + limit) / limit;
                $( '.current-page' ).html( page );
                $( '.total-pages' ).html( pages );

                if( page < pages )
                {
                    $( '.page-next' ).removeAttr('disabled');
                    $( '.page-last' ).removeAttr('disabled');
                }

                if( page > 1 )
                {
                    $( '.page-prev' ).removeAttr('disabled');
                    $( '.page-first' ).removeAttr('disabled');
                }

            }
            else
            {
                $( '.tablenav-pages-navspan' ).attr('disabled', 'disabled');
            }

            if( items == 0 )
			{
				forms = '<tr><td colspan="4">No forms found!</td></tr>';
			}
			else
			{
				$.each(data.forms, function(i, form)
				{
					
                    var subs = form.submissions;
                    if( form.submissions != '0' )
                    {
                        subs = '<a href="admin.php?page=wubwubwub_wp_forms_submissions&name=' + form.name + '&form=' + form.id + '">' + form.submissions + '</a>';
                    }

                    var options = '<button data-id="' + form.id + '" class="button wubwubwub-wp-forms-edit-form-button">Edit</button> ';
                    options += '<button data-id="' + form.id + '" class="button wubwubwub-wp-forms-info-form-button">Info</button> ';
                    options += '<button data-id="' + form.id + '" class="button wubwubwub-wp-forms-remove-form-button">Remove</button>';
                    options += '<div class="remove-form-prompt remove-form-prompt' + form.id + '">';
                    options += '<span>This action cannot be undone and any associated submissions will be deleted. Are you sure?</span><br>';
                    options += '<button data-id="' + form.id + '" class="button remove-form-prompt-yes">Yes</button> ';
                    options += '<button data-id="' + form.id + '" class="button remove-form-prompt-no">No</button>';
                    options += '</div>';

                    forms += '<tr>';
                    forms += '<td class="column-main">';
                    forms += '<strong>' + form.name + '</strong>';
                    forms += '<div class="display-small">';
                    forms += 'Submissions: ' + subs + '<br>';
                    forms += 'Created: ' + form.date_created + '<br>';
                    forms += options;
                    forms += '</div>';
                    forms += '</td>';
                    

                    forms += '<td>' + subs + '</td>';
                    forms += '<td>' + form.date_created + '</td>';
                    forms += '<td class="wubwubwub-wp-forms-form-options-cell' + form.id + '">';
                    forms += options;
					forms += '</td>';
                    forms += '</tr>';
				});
			}
			$( '#the-list' ).html( forms );
        })
        .fail(function( data ) {
            console.log( "error" );
            $( '#wubwubwub-wp-notify' ).html( '<div class="notice notice-error is-dismissible"><p>Error: data request failed. Try reloading the page.</p></div>' );
        });
    }

    get_forms();

    // Edit form
	$( document ).on( 'click', '.wubwubwub-wp-forms-edit-form-button', function( e )
	{
		e.preventDefault();
		var id = $( this ).attr( 'data-id' );
        window.location.href = "admin.php?page=wubwubwub_wp_forms_edit&form=" + id;
	});

    // Remove form from list
	$( document ).on( 'click', '.wubwubwub-wp-forms-remove-form-button', function( e )
	{
		e.preventDefault();
		var id = $( this ).attr( 'data-id' );
		$( '.remove-form-prompt' ).not( '.remove-form-prompt' + id ).slideUp();
		$( '.remove-form-prompt' + id ).slideToggle();
	});

    $( document ).on( 'click', '.remove-form-prompt-no', function( e )
	{
		e.preventDefault();
		$( '.remove-form-prompt' ).slideUp();
	});

    $( document ).on( 'click', '.remove-form-prompt-yes', function( e )
	{
		e.preventDefault();
		var endpoint = $( '#wubwubwub-wp-forms' ).data( 'endpoint' );
		var data = {
			action: 'delete_form',
			id: $( this ).attr( 'data-id' ),
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
            var forms = '<tr><td colspan="4">Refreshing ...</td></tr>';
			$( '#the-list' ).html( forms );
			get_forms();
		})
		.fail(function()
		{
			console.log("OH NOES! AJAX error");
            $( '#wubwubwub-wp-notify' ).html( '<div class="notice notice-error is-dismissible"><p>Error: failed to remove form. Try reloading the page.</p></div>' );
		});
	});

    // Get form info
	$( document ).on( 'click', '.wubwubwub-wp-forms-info-form-button', function( e )
	{
        e.preventDefault();
		var id = $( this ).attr( 'data-id' );
        window.location.href = "admin.php?page=wubwubwub_wp_forms_info&form=" + id;
	});

    // Paging
    $( document ).on( 'click', '.page-first', function( e )
    {
        e.preventDefault();
        $( '#wubwubwub-wp-forms' ).data( 'offset', 0 );
        on_page();
    });

    $( document ).on( 'click', '.page-prev', function( e )
    {
        e.preventDefault();
        var offset = $( '#wubwubwub-wp-forms' ).data( 'offset' );
        var limit = $( '#wubwubwub-wp-forms' ).data( 'limit' );
        offset = offset - limit;
        $( '#wubwubwub-wp-forms' ).data( 'offset', offset );
        on_page();
    });

    $( document ).on( 'click', '.page-last', function( e )
    {
        e.preventDefault();
        var pages = $( '#wubwubwub-wp-forms' ).data( 'pages' );
        var limit = $( '#wubwubwub-wp-forms' ).data( 'limit' );
        var offset = ( pages * limit ) - limit;
        $( '#wubwubwub-wp-forms' ).data( 'offset', offset );
        on_page();
    });

    $( document ).on( 'click', '.page-next', function( e )
    {
        e.preventDefault();
        var offset = $( '#wubwubwub-wp-forms' ).data( 'offset' );
        var limit = $( '#wubwubwub-wp-forms' ).data( 'limit' );
        offset = offset + limit;
        $( '#wubwubwub-wp-forms' ).data( 'offset', offset );
        on_page();
    });

    function on_page()
    {
        get_forms();
    }

});
