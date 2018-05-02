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

		$client = $this->couch_client->getMasterClient('test1');
		return $this->couch_client->upsert($account, $client);

	}

	public function update(Account $account) : bool {
		$client = $this->couch_client->getMasterClient('test1');

		if($this->couch_client->upsert($account, $client) !== null){
			return true;
		} else {
			return false;
		}
	}
	
	public function getByUsername(string $username) {
		$client = $this->couch_client->getMasterClient('test1');
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
				$client = $this->couch_client->getMasterClient('test1');
				$dbAccount->apiKey = Uuid::uuid4();
				$apiKey = !!$this->couch_client->upsert($dbAccount, $client) ? $dbAccount->apiKey : '';
				return $apiKey;
			}
		}

		return null;
	}

	public function getByApiKey(string $apiKey) {
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

	public function getById(string $id) {
		$client = new CouchClient('http://admin:admin@127.0.0.1:5984', 'test1');
		if(!$client->databaseExists()){
			$client->createDatabase();
		}

		try {
			$doc = $client->getDoc($id);
		}
		catch(Exception $e) {
			$doc = null;
		}

		$result = null;
		if($doc !== null) {
			$result = Account::parseFromDocument($doc);
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