<?php

class Heartbeat_controller extends CI_Controller {

	public function __construct() {
		parent::__construct();
	}

	public function index() {
		$this->json_response->Ok();
	}
}