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
$hook['post_controller_constructor'] = function()
{
	$ci = &get_instance();
	$method = $ci->input->method();
	$content_type = $ci->input->get_request_header('content-type');
	if($content_type === 'application/json') {
		if($method === "post" || $method === "put" || $method == "delete") {
			$data = json_decode($ci->input->raw_input_stream);
			if($data !== null) {
				$fields = get_object_vars($data);
				foreach($fields as $field => $key) {
					$_POST[$field] = $data->$field;
				}
			}
		}
	}
};