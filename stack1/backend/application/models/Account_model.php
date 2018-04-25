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

		$accountDoc = new CouchDocument($client);

		$accountDoc->set(Account::parseToArray($account));

		$account->id = $accountDoc->id();

		return $account;

	}

	public function update(){

	}

	public function get(){

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

	public static function parseToArray(Account $account, $includeID = false) : array {
		$parsedAccount = (array) $account;
		if(!$includeID) {
			unset($parsedAccount['id']);
		}

		return $parsedAccount;
	}

	public static function parseFromDocument(CouchDocument $document) : Account {
		$account = new Account();
		$account->username = $document->username;
		$account->password = $document->password;
		$account->id = $document->id();
	}

}