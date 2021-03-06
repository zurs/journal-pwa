<?php

class Account_controller extends CI_Controller {
	public function __construct(){
		parent::__construct();
    }

    public function login(){
        $account = new Account();
	    $account->username = $this->input->post('username');
	    $account->password = $this->input->post('password');

	    //exit(var_dump($this->input->raw_input_stream));
	    $dbAccount = $this->account_model->getByUsername($account->username);

	    if($dbAccount) {
	        $apiKey = $this->account_model->authenticate($account, $dbAccount);
	        if($apiKey){
	            $this->json_response->Ok(['apiKey' => $apiKey]);
            }
        }
        $this->json_response->Error('Kunde inte logga in');
    }

    public function create(){
        $account = new Account();
        $account->username = $this->input->post('username');
        $account->password = $this->input->post('password');

        $account = $this->account_model->create($account);
        if($account){
            $this->json_response->Ok($account);
        }
        $this->json_response->Error('Kunde inte skapa kontot');
    }
}