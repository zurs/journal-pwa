<?php

class Current_account {

    public $id;
    public $username;
    public $password;
    public $apiKey;

    public function __construct(){
        $ci = &get_instance();
        $ci->load->model('account_model');
        $apiKey = $ci->input->post_get('apiKey');

        if(!$apiKey){
            $ci->json_response->Error('Ingen API-nyckel skickad');
        }

        $account = $ci->account_model->getByApiKey($apiKey);
        if($account){
            $this->id       = $account->id;
            $this->username = $account->username;
            $this->password = $account->password;
            $this->apiKey   = $account->apiKey;
        }
        else {
            // Return HTTP 400
        }
    }

}