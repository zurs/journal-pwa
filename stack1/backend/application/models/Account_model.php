<?php
/**
 * Created by PhpStorm.
 * User: hampusek
 * Date: 2018-04-25
 * Time: 10:11
 */

use PHPOnCouch\CouchClient;
use Ramsey\Uuid\Uuid;


class Account_model extends CI_Model{


	public function __construct()
	{
		parent::__construct();
	}

	public function create(Account $account): Account {

		$account->password = password_hash($account->password, PASSWORD_BCRYPT);

		$client = new CouchClient('http://admin:admin@127.0.0.1:5984', 'test1');
		if(!$client->databaseExists()) {
			$client->createDatabase();
		}

		$response = null;
		try {
			$response = $client->storeDoc(Account::parseToDocument($account));
		} catch(Exception $e) {
			$response = null;
		}

		if($response !== null) {
			$account->id = $response->id;
		}
		else {
			$account = null;
		}

		return $account;

	}

	public function update(Account $account) : bool {
		$client = new CouchClient('http://admin:admin@127.0.0.1:5984', 'test1');
		if(!$client->databaseExists()) {
			$client->createDatabase();
		}

		$response = null;
		try {
			$accountDoc = Account::parseToDocument($account, true);
			$response = $client->storeDoc($accountDoc);
		} catch(Exception $e) {
			$response = null;
		}

		if($response !== null) {
			$account->rev = $response->rev;
			return true;
		}
		else {
			return false;
		}
	}

	public function getByUsername($username) {
		$client = new CouchClient('http://admin:admin@127.0.0.1:5984', 'test1');
		if(!$client->databaseExists()){
			$client->createDatabase();
		}
		$selector = ['username' => $username];

		$docs = $client->limit(1)->find($selector);

		$result = null;
		if(count($docs) === 1) {
			$accountDoc = reset($docs);
			$result = Account::parseFromDocument($accountDoc);
		}
		return $result;
	}

	public function authenticate(Account $account, Account $dbAccount) {
		if($account->username === $dbAccount->username) {
			$isAuth = password_verify($account->password, $dbAccount->password);

			if($isAuth) {
				$dbAccount->apiKey = Uuid::uuid4();
				$this->update($dbAccount);
				return $dbAccount->apiKey;
			}
		}

		return null;
	}

	public function getByApiKey($apiKey){
		if($apiKey === null)
			return null;

		$client = new CouchClient('http://admin:admin@127.0.0.1:5984', 'test1');
		if(!$client->databaseExists()){
			$client->createDatabase();
		}
		$selector = ['apiKey' => $apiKey];

		$docs = $client->limit(1)->find($selector);

		$result = null;
		if(count($docs) === 1) {
			$accountDoc = reset($docs);
			$result = Account::parseFromDocument($accountDoc);
		}
		return $result;
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

	public static function parseToDocument(Account $account, $update = false) : stdClass {
		return CouchHelper\parseToDocument($account, $update);
	}

	public static function parseFromDocument(stdClass $document) : Account {
		return CouchHelper\parseFromDocument($document, Account::class);
	}

}