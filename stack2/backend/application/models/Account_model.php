<?php

use Ramsey\Uuid\Uuid;

class Account_model extends CI_Model {
    public function __construct(){
        parent::__construct();
    }

    public function create(Account $account): Account{

        $account->password = password_hash($account->password, PASSWORD_BCRYPT);

        $account->id = Uuid::uuid4();

        $builder = $this->cassandra_client
            ->insert('accounts', ['id' => $account->id, 'username' => $account->username, 'password' => $account->password]);

        if($this->cassandra_client->run($builder)) {
            return $account;
        }
        return null;
    }

    public function update(Account $account): bool {
        $builder = $this->cassandra_client
            ->update('accounts', ['apiKey' => $account->apiKey])
            ->where('id', $account->id);

        return $this->cassandra_client->run($builder) !== null;
    }

    public function getByUsername(string $username) {
        $query = $this->cassandra_client
            ->select(['*'])
            ->where('username', $username)
            ->from('stack2.accounts')
            ->limit(1);

        $result = $this->cassandra_client->run($query);
        if($result !== null) {
            return Account::parseFromDocument($result);
        }
        return null;
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

    use Cql_Parsable;

    public $username;
    public $password;
    public $apiKey;


}