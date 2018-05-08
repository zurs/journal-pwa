<?php
/**
 * Created by PhpStorm.
 * User: hampusek
 * Date: 2018-04-25
 * Time: 10:11
 */
use Ramsey\Uuid\Uuid;


class Account_model extends CI_Model{


	public function __construct() {
		parent::__construct();
	}

	public function create(Account $account): Account {

		$account->password = password_hash($account->password, PASSWORD_BCRYPT);

		$client = $this->couch_client->getMasterClient('');
		return $this->couch_client->insert($account, $client);

	}

	public function update(Account $account) : bool {
		$client = $this->couch_client->getMasterClient('');
		return $this->couch_client->update($account, $client) !== null;
	}
	
	public function getByUsername(string $username) {
		$client = $this->couch_client->getMasterClient('');
		return $this->couch_client->getBySelector(['username' => $username], Account::class, $client, 1);
	}

	public function authenticate(Account $account, Account $dbAccount) {
		if($account->username === $dbAccount->username) {
			$isAuth = password_verify($account->password, $dbAccount->password);

			if($isAuth) {
				$dbAccount->apiKey = Uuid::uuid4();
				if($this->update($dbAccount)) {
					return $dbAccount->apiKey;
				}
			}
		}
		return null;
	}

	public function getByApiKey(string $apiKey) {
		if($apiKey === null) {
			return null;
		}

		$client = $this->couch_client->getMasterClient('');
		return $this->couch_client->getBySelector(['apiKey' => $apiKey], Account::class, $client, 1);
	}

	public function getById(string $id) {
		$client = $this->couch_client->getMasterClient('');
		return $this->couch_client->getById($id, Account::class, $client);
	}
}

class Account {
	use \CouchHelper\ParsableToCouch;
	/*
	 * @var string
	 */
	public $username;

	/*
	 * @var string
	 */
	public $password;

	/*
	 * @var string
	 */
	public $apiKey;
}