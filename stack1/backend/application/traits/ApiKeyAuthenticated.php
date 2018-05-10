<?php

trait ApiKeyAuthenticated {
	private $account;
	public function authenticateRequest(){
		$ci = &get_instance();
		$ci->load->model('account_model');

		$apiKey = $ci->input->post_get('apiKey');

		if($apiKey === '' || !$apiKey){
			$ci->json_response->Error('API-nyckel saknas', 401);
		}

		$this->account = $ci->account_model->getByApiKey($apiKey);
		if($this->account === null){
			$ci->json_response->Error('Ogiltig nyckel', 401);
		}
	}


	public function getCurrentAccount() {
		return $this->account;
	}

}