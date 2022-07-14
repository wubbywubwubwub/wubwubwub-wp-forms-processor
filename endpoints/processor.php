<?php
if ( ! defined( 'WPINC' ) ) { die('Direct access prohibited!'); }

/**
 * Validation: UK postcodes
 * See: https://www.townscountiespostcodes.co.uk/postcodes/tools/php-postcode-validation-script.php
 */
function wubwubwub_wp_forms_test_postcode($postcode)
{
    $postcode = str_replace( ' ', '', $postcode );
    $postcode = strtoupper( $postcode );

    if(preg_match("/^[A-Z]{1,2}[0-9]{2,3}[A-Z]{2}$/",$postcode)
        || preg_match("/^[A-Z]{1,2}[0-9]{1}[A-Z]{1}[0-9]{1}[A-Z]{2}$/",$postcode)
        || preg_match("/^GIR0[A-Z]{2}$/",$postcode))
    {
        return true;
    }

    return false;
}

/**
 * Validation: U.S. zip codes
 * See: http://docstore.mik.ua/orelly/webprog/pcook/ch09_03.htm
 */
function wubwubwub_wp_forms_test_zipcode($zipcode)
{
    return preg_match('/^[0-9]{5}([- ]?[0-9]{4})?$/', $zipcode);
}

// Form Processor
function wubwubwub_wp_forms_processor( $request_data )
{
    global $wpdb;

    $data = $request_data->get_params();

    // Test form exists
    if( !isset( $data['form'] ) || trim( $data['form'] ) == '' )
    {
        $data['error'] = 'No form data present.';
        return $data;
    }

    // Test nonce
     if( !isset( $_SERVER['HTTP_X_WP_NONCE'] ) || trim( $_SERVER['HTTP_X_WP_NONCE'] ) == '' )
     {
         $data['error'] = 'Nonce not set.';
         return $data;
     }

     if( ! wp_verify_nonce( $_SERVER['HTTP_X_WP_NONCE'], 'wp_rest' ) )
     {
         $data['error'] = 'Security field mismatch.';
         return $data;
     }

    // Test form actually exists
    $sql = $wpdb->prepare('SELECT * FROM wubwubwub_wp_forms WHERE form = %s', $data['form']);
    $form = $wpdb->get_row( $sql, ARRAY_A );

    if( $wpdb->num_rows === 0 )
    {
        $data['error'] = 'Form not found.';
        return $data;
    }

    // Test for required fields
    $required_fields = json_decode( $form['required_fields'] );

    foreach ( $required_fields as $required )
    {
        if( !isset( $data[$required] ) || trim( $data[$required] ) === '' )
        {
            $data['error'] = 'Required field "' . $required . '" missing.';
            return $data;
        }
    }

    // Test for valid email address, if $data['email'] is provided
    if( isset( $data['email'] ) )
    {
        if ( !filter_var($data['email'], FILTER_VALIDATE_EMAIL) === true )
        {
            $data['error'] = 'Please provide a valid email address';
            return $data;
        }
    }

    // Test for valid URL, if $data['url'] is provided
    if( isset( $data['url'] ) && trim($data['url']) != '' )
    {
        if ( !filter_var( $data['url'], FILTER_VALIDATE_URL ) === true )
        {
            $data['error'] = 'Please provide a valid URL';
            return $data;
        }
    }

    // Test for valid URL, if $data['url'] is provided
    if( isset( $data['website'] ) && trim($data['website']) != '' )
    {
        $url = parse_url( $data['website'] );
        if ( empty( $url['scheme'] ) )
        {
            $website = 'https://' . $data['website'];
        }

        if ( !filter_var( $website, FILTER_VALIDATE_URL ) === true )
        {
            $data['error'] = 'Please provide a valid website address';
            return $data;
        }
    }

    // Test for valid U.S. zip code, if $data['zipcode'] is provided
    if( isset( $data['zipcode'] ) && trim($data['zipcode']) != '' )
    {
        if ( !wubwubwub_wp_forms_test_zipcode( $data['zipcode'] ) )
        {
            $data['error'] = 'Please provide a valid zipcode';
            return $data;
        }
    }

    // Test for valid postcode, if $data['postcode'] is provided
    if( isset( $data['postcode'] ) && trim($data['postcode']) != '' )
    {
        if ( !wubwubwub_wp_forms_test_postcode( $data['postcode'] ) )
        {
            $data['error'] = 'Please provide a valid postcode';
            return $data;
        }
    }

    // Insert data into submissions table
    unset( $data['form'] );
    
    if( isset( $data['email_subject'] ) )
    {
        $subject = $data['email_subject'];
        unset( $data['email_subject'] );
    }

    $wpdb->insert( 'wubwubwub_wp_forms_submissions',
        array( 'form_id' => $form['id'],
               'data' => json_encode( $data ),
               'ip' => $_SERVER['REMOTE_ADDR'],
               'date_created' => current_time( 'mysql' )
        ),
        array( '%d', '%s', '%s', '%s' )
    );
    $id = $wpdb->insert_id;

    // Send email, if required
    $to = json_decode( $form['to_recipients'] );
    if( count( $to ) > 0 )
    {
        if( !isset( $subject ) )
        {
            $subject = get_bloginfo( 'name' ) . ': form submission';
        }

        $message  = 'Form submission from website: ' . get_bloginfo( 'name' ) . "\r\n";
        $message .= 'Submitted on: ' . date('l jS \of F Y H:i:s') . "\r\n";
        $message .= ".\r\n\r\n";

        foreach ($data as $key => $value)
        {
            $message .= $key . ': ' . $value . "\r\n\r\n";
        }

        $headers = array();

        $cc_recipients = json_decode( $form['cc_recipients'] );
        if( count( $cc_recipients ) > 0 )
        {
            foreach ( $cc_recipients as $cc )
            {
                $headers[] = 'Cc: ' . $cc;
            }
        }

        $bcc_recipients = json_decode( $form['bcc_recipients'] );
        if( count( $bcc_recipients ) > 0 )
        {
            foreach ( $bcc_recipients as $bcc )
            {
                $headers[] = 'Bcc: ' . $bcc;
            }
        }

        wp_mail( $to, $subject, $message, $headers );
    }

    return $data;
}
