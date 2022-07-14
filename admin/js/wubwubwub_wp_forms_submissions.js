jQuery(document).ready(function($)
{
    // Get wp nonce for authentication and set-up ajax
    $.ajaxSetup({
        beforeSend: function(xhr) {
            xhr.setRequestHeader( 'X-WP-Nonce', $( '#wubwubwub-wp-nonce' ).val() );
        }
    });

    // List submissions
    function get_subs()
    {
        $( '.tablenav-pages-navspan' ).attr('disabled', 'disabled');
        var endpoint = $( '#wubwubwub-wp-forms-submissions' ).data( 'endpoint' );
        var data = {
            action: 'list_subs',
            offset: $( '#wubwubwub-wp-forms-submissions' ).data( 'offset' ),
            limit: $( '#wubwubwub-wp-forms-submissions' ).data( 'limit' ),
            form: $( '#wubwubwub-wp-forms-submissions' ).data( 'form' ),
            search: $( '#wubwubwub-wp-forms-search' ).val(),
        };
        
        $.ajax({
            url: endpoint,
            type: 'GET',
            dataType: 'json',
            data: data
        })
        .done(function( data ) {
            var items = data.total.submissions;
            $( '.displaying-num' ).html( items + ' items' );

            // Paging
            if( items > 0 )
            {
                $( '.wubwubwub-wp-forms-remove-all-subs' ).removeAttr( 'disabled' );
                var limit = $( '#wubwubwub-wp-forms-submissions' ).data( 'limit' );
                var pages = Math.ceil( items / limit );
                $( '#wubwubwub-wp-forms-submissions' ).data( 'pages', pages );
                $( '#wubwubwub-wp-forms-submissions' ).data( 'total', items );
                var offset = $( '#wubwubwub-wp-forms-submissions' ).data( 'offset' );
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

            var subs = '';
			if( data.num_rows == 0 )
			{
				subs = '<tr><th colspan="4">No data found!</th></tr>';
			}
			else
			{
				$.each(data.subs, function(i, sub)
				{
                    subs += '<tr class="sub" data-id="' + sub.id + '">';
                    subs += '<th class="check-column"><input class="wubwubwub-wp-forms-remove-sub" type="checkbox" value="' + sub.id + '"></th>';
                    subs += '<td class="column-main wubwubwub-wp-forms-sub">' + sub.name + '</td>';
					subs += '<td class="wubwubwub-wp-forms-sub">' + sub.date_created + '</td>';
                    subs += '<td class="wubwubwub-wp-forms-sub">' + sub.ip + '</td>';
					subs += '</tr>';
				});
			}
			$( '#the-list' ).html( subs );
        })
        .fail(function( data ) {
            console.log( "error" );
        });
    }

    get_subs();

    /**
     * Paging
     */
    $( document ).on( 'click', '.page-first', function( e )
    {
        e.preventDefault();
        $( '#wubwubwub-wp-forms-submissions' ).data( 'offset', 0 );
        on_page();
    });

    $( document ).on( 'click', '.page-prev', function( e )
    {
        e.preventDefault();
        var offset = $( '#wubwubwub-wp-forms-submissions' ).data( 'offset' );
        var limit = $( '#wubwubwub-wp-forms-submissions' ).data( 'limit' );
        offset = offset - limit;
        $( '#wubwubwub-wp-forms-submissions' ).data( 'offset', offset );
        on_page();
    });

    $( document ).on( 'click', '.page-last', function( e )
    {
        e.preventDefault();
        var pages = $( '#wubwubwub-wp-forms-submissions' ).data( 'pages' );
        var limit = $( '#wubwubwub-wp-forms-submissions' ).data( 'limit' );
        var offset = ( pages * limit ) - limit;
        $( '#wubwubwub-wp-forms-submissions' ).data( 'offset', offset );
        on_page();
    });

    $( document ).on( 'click', '.page-next', function( e )
    {
        e.preventDefault();
        var offset = $( '#wubwubwub-wp-forms-submissions' ).data( 'offset' );
        var limit = $( '#wubwubwub-wp-forms-submissions' ).data( 'limit' );
        offset = offset + limit;
        $( '#wubwubwub-wp-forms-submissions' ).data( 'offset', offset );
        on_page();
    });

    function on_page()
    {
        get_subs();
        $( '#wubwubwub-wp-forms-checkall-subs' ).attr( 'checked', false );
        $( '.wubwubwub-wp-forms-remove-selected-subs' ).attr('disabled', 'disabled');
    }

    /**
     * View data
     */
    $( document ).on( 'click', '.wubwubwub-wp-forms-sub', function( e )
    {
        e.preventDefault();
        var id = $( this ).closest( 'tr' ).data( 'id' );

        if( $( "#wubwubwub-wp-forms-submission-details-" + id ).length )
        {
            $( '.wubwubwub-wp-forms-submission-details' ).remove();
            return;
        }

        $( '.wubwubwub-wp-forms-submission-details' ).remove();

        var row = '<tr id="wubwubwub-wp-forms-submission-details-' + id + '" class="wubwubwub-wp-forms-submission-details"><th colspan="4"><div class="">Retrieving data ...</div></td></tr>';
        $( this ).closest( "tr" ).after( row );
        var endpoint = $( '#wubwubwub-wp-forms-submissions' ).data( 'endpoint' );
        var data = {
            action: 'get_sub',
            id: id
        };
        
        $.ajax({
            url: endpoint,
            type: 'GET',
            dataType: 'json',
            data: data
        })
        .done(function( data ) {
            var sub = JSON.parse( data.sub.data );
            var details = '';
            $.each(sub, function(key, val)
            {
                details += '<strong>' + key + ':</strong> ' + val + '<br>';
            });
            $( '.wubwubwub-wp-forms-submission-details div' ).html( details );
        })
        .fail(function( data ) {
            console.log( "error" );
        });
    });

    /**
     * Select all rows
     */
    $( document ).on( 'click', '#wubwubwub-wp-forms-checkall-subs', function( e )
    {
        if( $( this ).is( ':checked' ) )
        {
            $( '.wubwubwub-wp-forms-remove-sub' ).attr( 'checked', true );
            $( '.wubwubwub-wp-forms-remove-selected-subs' ).removeAttr('disabled');
        }
        else
        {
            $( '.wubwubwub-wp-forms-remove-sub' ).attr( 'checked', false );
            $( '.wubwubwub-wp-forms-remove-selected-subs' ).attr('disabled', 'disabled');
        }
    });

    /**
     * Select row
     */
    $( document ).on( 'click', '.wubwubwub-wp-forms-remove-sub', function( e )
    {
        $( '#wubwubwub-wp-forms-checkall-subs' ).attr( 'checked', false );
        var nochecks = true;
        $( '.wubwubwub-wp-forms-remove-sub' ).each(function(i, el) {
            if( $( this ).is( ':checked' ) )
            {
                nochecks = false;
            }
        });
        if( nochecks == false )
        {
            $( '.wubwubwub-wp-forms-remove-selected-subs' ).removeAttr('disabled');
        }
        else
        {
            $( '.wubwubwub-wp-forms-remove-selected-subs' ).attr('disabled', 'disabled');
        }
    });

    /**
     * Remove selected subs
     */
    $( document ).on( 'click', '.wubwubwub-wp-forms-remove-selected-subs', function( e )
    {
        e.preventDefault();
        tb_show("","#TB_inline?height=150&amp;width=405&amp;inlineId=wubwubwub-wp-forms-notify-remove-selected&amp;modal=true",null);

    });

    $( document ).on( 'click', '#wubwubwub-wp-forms-confirm-remove-selected-subs', function( e )
    {
        e.preventDefault();
        $( this ).attr('disabled', 'disabled');
        var subs = [];
        $( '.wubwubwub-wp-forms-remove-sub' ).each(function(i, el) {
            if( $( this ).is( ':checked' ) )
            {
                subs.push( $( this ).val() );
            }
        });
        var endpoint = $( '#wubwubwub-wp-forms-submissions' ).data( 'endpoint' );
        var data = {
            action: 'remove_selected_subs',
            subs: subs,
            form: $( '#wubwubwub-wp-forms-submissions' ).data( 'form' )
        };
        
        $.ajax({
            url: endpoint,
            type: 'GET',
            dataType: 'json',
            data: data
        })
        .done(function( data ) {
            get_subs();
            var total = data.total;
            var offset = $( '#wubwubwub-wp-forms-submissions' ).data( 'offset' );
            var limit = $( '#wubwubwub-wp-forms-submissions' ).data( 'limit' );
            if ( total == 0 )
            {
                window.location.href = "admin.php?page=wubwubwub_wp_forms";
                return;
            }
            if ( offset >= total )
            {
                offset = offset - limit;
                $( '#wubwubwub-wp-forms-submissions' ).data( 'offset', offset );
                on_page();
            }
            $( '.wubwubwub-wp-forms-remove-selected-subs' ).attr('disabled', 'disabled');
            $( '#wubwubwub-wp-forms-checkall-subs' ).attr( 'checked', false );
            $( '#wubwubwub-wp-forms-confirm-remove-selected-subs' ).removeAttr('disabled');
            tb_remove();
        })
        .fail(function() {
            console.log( "error" );
        });

    });

    /**
     * Remove all subs
     */
    $( document ).on( 'click', '.wubwubwub-wp-forms-remove-all-subs', function( e )
    {
        e.preventDefault();
        tb_show("","#TB_inline?height=150&amp;width=405&amp;inlineId=wubwubwub-wp-forms-notify-remove-all&amp;modal=true",null);

    });

    $( document ).on( 'click', '#wubwubwub-wp-forms-confirm-remove-all-subs', function( e )
    {
        e.preventDefault();
        $( this ).attr('disabled', 'disabled');
        var endpoint = $( '#wubwubwub-wp-forms-submissions' ).data( 'endpoint' );
        var data = {
            action: 'remove_all_subs',
            form: $( '#wubwubwub-wp-forms-submissions' ).data( 'form' )
        };
        
        $.ajax({
            url: endpoint,
            type: 'GET',
            dataType: 'json',
            data: data
        })
        .done(function( data ) {
            window.location.href = "admin.php?page=wubwubwub_wp_forms";
        })
        .fail(function() {
            console.log( "error" );
        });

    });

    $( document ).on( 'click', '.wubwubwub-thickbox-dismiss-button', function( e )
    {
        e.preventDefault();
        tb_remove();
    });


    // Type delay function for search box
    function type_delay(callback, ms) {
        var timer = 0;
        return function() {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                callback.apply(context, args);
            }, ms || 0);
        };
    }

    $( document ).on('keyup paste', '#wubwubwub-wp-forms-search', type_delay(function(event) {
        console.log('Time elapsed!', this.value);
        get_subs();
    }, 500));

});
