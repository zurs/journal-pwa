<?php

class Authenticated_controller extends CI_Controller {

	public function __construct() {
		parent::__construct();

		$apiKey = $this->input->post_get('apiKey');

		if(!$apiKey){
			$this->json_response->Error('Ingen API-nyckel skickad');
		}

		$account = $this->account_model->getByApiKey($apiKey);
		if($account === null) {
			$this->json_response->Error("", 401);
		}
		$this->current_account->setAccount($account);
	}

	public function getDb() {
		$this->json_response->Ok(['db' => $this->current_account->username]);
	}
}