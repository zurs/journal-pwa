<?php
defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * Created by PhpStorm.
 * User: eliasjohnsson
 * Date: 2018-04-25
 * Time: 13:52
 */
class Json_response
{
	public const CONTENT_TYPE_JSON 		= 'application/json';
	public const DEFAULT_OK_STATUS 		= 200;
	public const DEFAULT_ERROR_STATUS 	= 400;
	private $ci;

	public function __construct() {
		$this->ci = &get_instance();

	}

	public function Ok($data = null, $status = Json_response::DEFAULT_OK_STATUS, $exit = true) {
		$this->_createResponse($data, $status, $exit);
	}

	public function Error(string $message = "", $status = Json_response::DEFAULT_ERROR_STATUS, $exit = true) {
		$data = null;
		if(mb_strlen($message) > 0) {
			$data = ['error' => $message];
		}
		$this->_createResponse($data, $status, $exit);
	}

	private function _createResponse($data, $status, $exit = true) {
		$this->_setHeaders($status);
		$json = null;
		if($data !== null) {
			$json = $this->_parseJson($data);
		}


		if($exit) {
			$this->_exitResponse($json);
		}
		return $json;
	}

	private function _setHeaders(int $status, string $contentType = Json_response::CONTENT_TYPE_JSON) {
		$this->ci->output->set_status_header($status);
		$this->ci->output->set_content_type($contentType, 'utf8');
	}

	private function _exitResponse($data) {
		$this->ci->output->set_output($data);
		$this->ci->output->_display();
		exit();
	}

	private function _parseJson($data) : String {
		return json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
	}

}