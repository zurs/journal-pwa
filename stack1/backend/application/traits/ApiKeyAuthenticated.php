<?php

trait ApiKeyAuthenticated {
	function authenticateRequest(){
		$this->load->model('account_model');

		$apiKey = $this->input->post_get('apiKey');

		if($apiKey === '' || !$apiKey){
			$this->jsonresponse->Error('API-nyckel saknas');
		}

		$account = $this->account_model->getByApiKey($apiKey);
		if(!$account){
			$this->jsonresponse->Error('Ogiltig nyckel');
		}
	}
}