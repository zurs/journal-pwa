<?php

use Ramsey\Uuid\Uuid;

class Account_model extends CI_Model {
    public function __construct(){
        parent::__construct();
    }

    public function create(Account $account): Account{

        $account->password = password_hash($account->password, PASSWORD_BCRYPT);

        // Insert account into database and return
        return $account;
    }

    public function update(Account $account): bool {
        // Update account in database and return success status
    }

    public function getByUsername(string $username) {

    }

    public function authenticate(Account $account, Account $dbAccount) {
        if($account->username === $dbAccount->username){
            $isSame = password_verify($account->password, $dbAccount->password);

            if($isSame){
                $dbAccount->apiKey = Uuid::uuid4();
                if($this->update($dbAccount)){
                    return $dbAccount->apiKey;
                }
            }
        }
        return null;
    }

    public function getByApiKey(string $apiKey): Account{

    }

    public function getById(string $id): Account{

    }
}

class Account {

    public $username;
    public $password;
    public $apiKey;
}