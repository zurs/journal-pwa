<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| -------------------------------------------------------------------------
| Hooks
| -------------------------------------------------------------------------
| This file lets you define "hooks" to extend CI without hacking the core
| files.  Please see the user guide for info:
|
|	https://codeigniter.com/user_guide/general/hooks.html
|
*/
$hook['pre_controller'] = function() {
	$input = new CI_Input();
	$method = $input->method();
	$content_type = $input->get_request_header('content-type');
	if($content_type === 'application/json') {
		if($method === "post" || $method === "put" || $method == "delete") {
			$data = json_decode($input->raw_input_stream);
			if($data !== null) {
				$fields = get_object_vars($data);
				foreach($fields as $field => $value) {
					$_POST[$field] = $value;
				}
			}
		}
	}
};