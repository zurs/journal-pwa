<?php
/**
 * Created by PhpStorm.
 * User: eliasjohnsson
 * Date: 2018-04-27
 * Time: 11:01
 */

use PHPOnCouch\CouchClient;
class Journal_model extends CI_Model {

	function __construct(){
		parent::__construct();
		$this->load->library('couch_client');
	}

	public function create(Journal $journal): Journal {
		$client = $this->couch_client->getMasterDatabaseClient('test1_journals');

		$journal->submittedAt = date('Y-m-d H:i:s');

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