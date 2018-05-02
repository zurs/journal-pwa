<?php

trait ApiKeyAuthenticated {
	function authenticateRequest(){
		$this->load->model('account_model');

		$method = $_SERVER['REQUEST_METHOD'];

		$apiKey = '';

		if($method === 'POST'){
			$apiKey = $this->input->post('apiKey');
		}
		else if($method === 'GET'){
			$apiKey = $this->input->get('apiKey');
		}

		if($apiKey === '' || !$apiKey){
			$this->jsonresponse->Error('API-nyckel saknas');
		}

		$account = $this->account_model->getByApiKey($apiKey);
		if(!$account){
			$this->jsonresponse->Error('Ogiltig nyckel');
		}
	}
}