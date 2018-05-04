<?php

use Ramsey\Uuid\Uuid;

class Account_model extends CI_Model {
    public function __construct(){
        parent::__construct();
    }

    public function create(Account $account): Account{

        $account->password = password_hash($account->password, PASSWORD_BCRYPT);

        $uuid = Uuid::uuid4();

        $cluster   = Cassandra::cluster()                 // connects to localhost by default
            ->build();
        $keyspace  = 'stack2';
        $session   = $cluster->connect($keyspace);        // create session, optionally scoped to a keyspace
        $statement = new Cassandra\SimpleStatement(       // also supports prepared and batch statements
            "INSERT INTO stack2.accounts (id, username, password) VALUES (${uuid}, '{$account->username}', '{$account->password}')"
        );
        $future    = $session->executeAsync($statement);  // fully asynchronous and easy parallel execution
        $result    = $future->get();                      // wait for the result, with an optional timeout

        if($result){
            return $account;
        }

        // Insert account into database and return
        return null;
    }

    public function update(Account $account): bool {
        // Update account in database and return success status

        $cluster   = Cassandra::cluster()                 // connects to localhost by default
        ->build();
        $keyspace  = 'stack2';
        $session   = $cluster->connect($keyspace);        // create session, optionally scoped to a keyspace
        $statement = new Cassandra\SimpleStatement(       // also supports prepared and batch statements
            "UPDATE stack2.accounts SET apiKey = '{$account->apiKey}' WHERE username = {$account->username}"
        );
        $future    = $session->executeAsync($statement);  // fully asynchronous and easy parallel execution
        $result    = $future->get();                      // wait for the result, with an optional timeout

        if($result){
            return $account->apiKey;
        } else {
            return null;
        }
    }

    public function getByUsername(string $username) {
        $query = $this->cassandra_client
            ->select(['id', 'username', 'password'])
            ->where('username', $username)
            ->from('stack2.accounts');

        $result = $this->cassandra_client->run($query);
        $account = (object)$result[0];
        $account->id = $account->id->__toString();
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