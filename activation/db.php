<?php
if ( ! defined( 'WPINC' ) ) { die('Direct access prohibited!'); }

// Set-up database tables on plugin activation
function wubwubwub_wp_forms_processor_create_tables()
{
	global $wpdb;

	$sql = "CREATE TABLE IF NOT EXISTS `wubwubwub_wp_forms` (
			  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
			  `form` varchar(255) NOT NULL DEFAULT '',
			  `name` varchar(255) NOT NULL DEFAULT '',
              `required_fields` varchar(255) NOT NULL DEFAULT '',
              `to_recipients` varchar(255) NOT NULL DEFAULT '',
              `cc_recipients` varchar(255) NOT NULL DEFAULT '',
              `bcc_recipients` varchar(255) NOT NULL DEFAULT '',
			  `options` text NOT NULL DEFAULT '',
			  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
			  PRIMARY KEY (`id`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
	$query = $wpdb->query( $sql );

	$sql = "CREATE TABLE IF NOT EXISTS `wubwubwub_wp_forms_submissions` (
			  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
			  `form_id` int(11) NOT NULL,
			  `data` text NOT NULL DEFAULT '',
			  `ip` varchar(255) NOT NULL DEFAULT '',
			  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
			  PRIMARY KEY (`id`),
			  KEY `form_id` (`form_id`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
	$query = $wpdb->query( $sql );
}

wubwubwub_wp_forms_processor_create_tables();
