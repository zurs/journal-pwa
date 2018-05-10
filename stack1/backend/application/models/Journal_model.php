<?php
/**
 * Created by PhpStorm.
 * User: eliasjohnsson
 * Date: 2018-04-27
 * Time: 11:01
 */


class Journal_model extends CI_Model {
	const DB = 'journals';
	
	function __construct(){
		parent::__construct();
	}

	public function create(Journal $journal): ?Journal {
		$client = $this->couch_client->getMasterClient(self::DB);
		$journal->submittedAt = time();
		return $this->couch_client->insert($journal, $client);
	}

	public function delete(Journal $journal) : bool {;
		$client = $this->couch_client->getMasterClient(self::DB);
		return $this->couch_client->delete($journal, $client);
	}

	public function getById(string $id) {
		$client = $this->couch_client->getMasterClient(self::DB);
		return $this->couch_client->getById($id, Journal::class, $client);
	}

	public function getByPatientId(string $patientId) : array {
		$client = $this->couch_client->getMasterClient(self::DB);
		return $this->couch_client->getBySelector(['patientId' => $patientId], Journal::class, $client);
	}
}

class Journal {
	use \CouchHelper\ParsableToCouch;

	public $patientId;
	public $text;
	public $authorId;
	public $writtenAt;
	public $submittedAt;
}