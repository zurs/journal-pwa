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

	public function create(Journal $journal): ?Journal {
		$client = $this->couch_client->getMasterClient('_journals');
		$journal->submittedAt = time();
		return $this->couch_client->insert($journal, $client);
	}

	public function getById(string $id) {
		$client = $this->couch_client->getMasterClient('_journals');
		return $this->couch_client->getById($id, Journal::class, $client);
	}

	public function getByPatientId(string $patientId) : array {
		$client = $this->couch_client->getMasterClient('_journals');
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