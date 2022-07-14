<?php
if ( ! defined( 'WPINC' ) ) { die('Direct access prohibited!'); }

function wubwubwub_wp_forms_admin( $request_data )
{

    // Get params
    $data = $request_data->get_params();

    // Test for action
	if( !isset( $data['action'] ) )
 	{
 		$data['error'] = 'Please provide an action';
 		return $data;
 	}

    global $wpdb;
    switch ( $data['action'] )
	{
		case 'list_forms':
            $sql = "SELECT wubwubwub_wp_forms.id, name, wubwubwub_wp_forms.date_created, COUNT(form_id) AS submissions
                      FROM wubwubwub_wp_forms LEFT JOIN wubwubwub_wp_forms_submissions
                        ON wubwubwub_wp_forms.id = wubwubwub_wp_forms_submissions.form_id
                     GROUP BY wubwubwub_wp_forms.id";
            $sql .= " ORDER BY wubwubwub_wp_forms.id DESC LIMIT " . $data['limit'] . " OFFSET " . $data['offset'];
			$data['forms'] = $wpdb->get_results( $sql, ARRAY_A );
			$data['num_rows'] = $wpdb->num_rows;
            $data['total'] = $wpdb->get_var( "SELECT COUNT(*) FROM wubwubwub_wp_forms" );
			unset( $data['action'] );
			return $data;
			break;

        case 'delete_form':
			$wpdb->delete( 'wubwubwub_wp_forms', array( 'id' => $data['id'] ), array( '%d' ) );
            $wpdb->delete( 'wubwubwub_wp_forms_submissions', array( 'form_id' => $data['id'] ), array( '%d' ) );

			unset( $data['action'] );
			return $data;
			break;

        case 'create_form':
            if( !isset( $data['name'] ) || empty( $data['name'] ) )
            {
                $data['error'] = 'Please provide a name for the form';
                return $data;
            }
    		$sql = "SELECT * FROM wubwubwub_wp_forms
    				WHERE name = '" . $data['name'] . "';";
    		$result = $wpdb->get_results( $sql, ARRAY_A );

    		if( $wpdb->num_rows > 0 )
            {
                $data['error'] = 'Name already in use, try another';
                return $data;
            }
            unset( $data['action'] );
            $wpdb->insert( 'wubwubwub_wp_forms',
                array( 'form' => sha1( $data['name'] . microtime() ),
                       'name' => $data['name'],
                       'required_fields' => '[]',
                       'to_recipients' => '[]',
                       'cc_recipients' => '[]',
                       'bcc_recipients' => '[]',
                       'options' => '[]',
                       'date_created' => current_time( 'mysql' )
                ),
                array( '%s', '%s', '%s', '%s', '%s', '%s', '%s' )
            );
            $data['id'] = $wpdb->insert_id;
			return $data;
			break;

        case 'get_form':
			$sql = "SELECT * FROM wubwubwub_wp_forms WHERE id = " . $data['form'];
            $data['form'] = $wpdb->get_row( $sql, ARRAY_A );
            if( $wpdb->num_rows == 0 )
            {
                $data['error'] = 'Could not find form';
                return $data;
            }
			unset( $data['action'] );
			return $data;
			break;

        case 'save_form':
            if( trim( $data['name'] ) == '' )
            {
                $data['name'] = 'Untitled form ' . $data['id'];
            }

            $wpdb->update( 'wubwubwub_wp_forms', // table
                           array( 'name' => $data['name'],
                                  'required_fields' => $data['required_fields'],
                                  'to_recipients' => $data['to_recipients'],
                                  'cc_recipients' => $data['cc_recipients'],
                                  'bcc_recipients' => $data['bcc_recipients'] ), // data
                           array( 'id' => $data['id'] ), // where
                           array( '%s', '%s', '%s', '%s', '%s' ), // data format
                           array( '%d' ) // where format
                         );

			unset( $data['action'] );
			return $data;
			break;

        case 'list_subs':
            
            $sql = "SELECT COUNT(*) AS `submissions` FROM `wubwubwub_wp_forms_submissions`";
            
            if( $data['form'] != 'all' )
            {
                $sql .= " WHERE form_id = " . $data['form'];
            }

            if( $data['search'] != '' )
            {
                if( $data['form'] != 'all' )
                {
                    $sql .= " AND ";
                }
                else
                {
                    $sql .= " WHERE ";
                }

                $sql .= "wubwubwub_wp_forms_submissions.data LIKE '%" . $data['search'] . "%'";

            }

            $data['total'] = $wpdb->get_row( $sql, ARRAY_A );

            $sql = "SELECT wubwubwub_wp_forms_submissions.id, form_id, name, ip, wubwubwub_wp_forms_submissions.date_created
                    FROM wubwubwub_wp_forms_submissions
                    JOIN wubwubwub_wp_forms
                    ON wubwubwub_wp_forms_submissions.form_id = wubwubwub_wp_forms.id ";
            
            if( $data['form'] != 'all' )
            {
                $sql .= " WHERE form_id = " . $data['form'];
            }
            
            if( $data['search'] != '' )
            {
                if( $data['form'] != 'all' )
                {
                    $sql .= " AND ";
                }
                else
                {
                    $sql .= " WHERE ";
                }

                $sql .= "wubwubwub_wp_forms_submissions.data LIKE '%" . $data['search'] . "%'";

            }

            $sql .= " ORDER BY wubwubwub_wp_forms_submissions.id DESC LIMIT " . $data['limit'] . " OFFSET " . $data['offset'];
            $data['subs'] = $wpdb->get_results( $sql, ARRAY_A );
			$data['num_rows'] = $wpdb->num_rows;
			unset( $data['action'] );
			return $data;
			break;

        case 'get_sub':
            $sql = "SELECT * FROM wubwubwub_wp_forms_submissions WHERE id = " . $data['id'];
            $data['sub'] = $wpdb->get_row( $sql, ARRAY_A );
            if( $wpdb->num_rows == 0 )
            {
                $data['error'] = 'Could not find data';
                return $data;
            }
            unset( $data['action'] );
            return $data;
            break;

        case 'remove_selected_subs':
            foreach ( $data['subs'] as $sub )
            {
                $wpdb->delete( 'wubwubwub_wp_forms_submissions', array( 'id' => $sub ), array( '%d' ) );
            }
            $sql = "SELECT COUNT(*) AS `submissions` FROM `wubwubwub_wp_forms_submissions`";
            if( $data['form'] != 'all' )
            {
                $sql .= " WHERE form_id = " . $data['form'];
            }
            $data['total'] = $wpdb->get_row( $sql, ARRAY_A );
            $data['total'] = $data['total']['submissions'];
            unset( $data['action'] );
            return $data;
            break;

        case 'remove_all_subs':
            if( $data['form'] != 'all' )
            {
                $wpdb->delete( 'wubwubwub_wp_forms_submissions', array( 'form_id' => $data['form'] ), array( '%d' ) );
            }
            else
            {
                $wpdb->query( 'TRUNCATE TABLE wubwubwub_wp_forms_submissions' );
            }
            unset( $data['action'] );
            return $data;
            break;

		default:
			$data['error'] = 'Please provide a valid action';
			return $data;
			break;
	}

}
