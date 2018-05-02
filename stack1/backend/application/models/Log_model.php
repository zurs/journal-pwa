<?php
/**
 * Created by PhpStorm.
 * User: eliasjohnsson
 * Date: 2018-04-30
 * Time: 14:34
 */
use PHPOnCouch\CouchClient;

class Log_model extends CI_Model {
	public function __construct() {
		parent::__construct();
	}

	public function create(Log $log): Log {
		$client = new CouchClient('http://admin:admin@127.0.0.1:5984', 'test1_logs');
		if(!$client->databaseExists()) {
			$client->createDatabase();
		}

		$log->readAt = time();

		$response = null;
		try {
			$response = $client->storeDoc(Log::parseToDocument($log));
		} catch(Exception $e) {
			$response = null;
		}

		if($response !== null) {
			$log->id = $response->id;
		}
		else {
			$log = null;
		}

		return $log;
	}

	public function getByJournalId($journalId) : array {
		$client = new CouchClient('http://admin:admin@127.0.0.1:5984', 'test1_logs');
		if(!$client->databaseExists()) {
			$client->createDatabase();
		}

		$selector = ['journalId' => $journalId];

		$docs = $client->find($selector);

		$result = [];
		if(count($docs) > 0) {
			foreach($docs AS $doc) {
				$result[] =  Log::parseFromDocument($doc);
			}
		}

		return $result;
	}
}

class Log {
	use \CouchHelper\ParsableToCouch;

	public $journalId;
	public $readerId;
	public $readAt;

	public static function parseToDocument(Log $log) : stdClass {
		return CouchHelper\parseToDocument($log, false);
	}

	public static function parseFromDocument(stdClass $document) : Log {
		return CouchHelper\parseFromDocument($document, Log::class);
	}
}