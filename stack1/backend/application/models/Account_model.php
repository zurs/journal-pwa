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

	public function create(Account $account): Account{

		$account->password = password_hash($account->password, PASSWORD_BCRYPT);

		$client = new CouchClient('http://admin:admin@127.0.0.1:5984', 'test1');
		if(!$client->databaseExists()){
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

	public function update(){

	}

	public function getByUsername($username){
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

	public function isAuthenticated(Account $account, Account $dbAccount) : bool {
		$result = false;
		if($account->username === $dbAccount->username) {
			$result = password_verify($account->password, $dbAccount->password);
		}
		return $result;
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

	public static function parseToDocument(Account $account, $includeID = false) : stdClass {
		$parsedAccount = new stdClass();
		$parsedAccount->username = $account->username;
		$parsedAccount->password = $account->password;

		if($includeID) {
			$parsedAccount->id = $account->id;
		}

		return $parsedAccount;
	}

	public static function parseFromDocument(stdClass $document) : Account {
		$account = new Account();
		$account->username = $document->username;
		$account->password = $document->password;
		$account->id = $document->_id;

		return $account;
	}

}