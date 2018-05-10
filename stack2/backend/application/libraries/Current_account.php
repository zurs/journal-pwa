<?php

class Current_account {

    public $id;
    public $username;
    public $password;
    public $apiKey;

    public function setAccount(Account $account) {
        $this->id       = $account->id;
        $this->username = $account->username;
        $this->password = $account->password;
        $this->apiKey   = $account->apiKey;
    }
}