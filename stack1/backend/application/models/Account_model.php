<?php
/**
 * Created by PhpStorm.
 * User: hampusek
 * Date: 2018-04-25
 * Time: 10:11
 */

use PHPOnCouch\CouchClient;
use PHPOnCouch\CouchDocument;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\Exception\UnsatisfiedDependencyException;

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
			$response = $client->storeDoc(Account::parseToDocument($account, true));
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

	public function authenticate(Account $account, Account $dbAccount) : string {
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


}

class Account {
	/*
	 * @var string
	 */
	public $id;

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

	/*
	 * @var string
	 */
	public $rev;

	public static function parseToDocument(Account $account, $update = false) : stdClass {
		$parsedAccount = new stdClass();
		$parsedAccount->username 	= $account->username;
		$parsedAccount->password 	= $account->password;
		$parsedAccount->apiKey		= $account->apiKey;

		if($update) {
			$parsedAccount->_id 	= $account->id;
			$parsedAccount->_rev 	= $account->rev;
		}

		return $parsedAccount;
	}

	public static function parseFromDocument(stdClass $document) : Account {
		$account = new Account();
		$account->username 	= $document->username;
		$account->password 	= $document->password;
		$account->apiKey	= $document->apiKey;
		$account->id 		= $document->_id;
		$account->rev		= $document->_rev;

		return $account;
	}

}