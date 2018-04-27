<?php
/**
 * Created by PhpStorm.
 * User: eliasjohnsson
 * Date: 2018-04-27
 * Time: 11:01
 */

use PHPOnCouch\CouchClient;
class Journal_model extends CI_Model {

	public function create(Journal $journal): Journal {
		$client = new CouchClient('http://admin:admin@127.0.0.1:5984', 'test1_journals');
		if(!$client->databaseExists()) {
			$client->createDatabase();
		}

		$journal->submittedAt = time();

		$response = null;
		try {
			$response = $client->storeDoc(Journal::parseToDocument($journal));
		} catch(Exception $e) {
			$response = null;
		}

		if($response !== null) {
			$journal->id = $response->id;
		}
		else {
			$journal = null;
		}

		return $journal;

	}
}

class Journal {
	use \CouchHelper\ParsableToCouch;

	public $patientId;
	public $text;
	public $authorId;
	public $writtenAt;
	public $submittedAt;

	public static function parseToDocument(Journal $journal) : stdClass {
		return CouchHelper\parseToDocument($journal, false);
	}

	public static function parseFromDocument(stdClass $document) : Journal {
		return CouchHelper\parseFromDocument($document, Journal::class);
	}
}