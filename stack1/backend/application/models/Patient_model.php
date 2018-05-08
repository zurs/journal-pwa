<?php
/**
 * Created by PhpStorm.
 * User: hampusek
 * Date: 2018-04-27
 * Time: 14:21
 */

use PHPOnCouch\CouchClient;

class Patient_model extends CI_Model {

	function __construct() {
		parent::__construct();
		$this->load->library('couch_client');
	}

	public function create(Patient $patient) {
		$client = $this->couch_client->getMasterClient('_patients');
		return $this->couch_client->insert($patient, $client);
	}

	public function delete(Patient $patient) : bool {
		$client = $this->couch_client->getMasterClient('_patients');
		return $this->couch_client->delete($patient, $client);
	}

	public function getById(string $id) {
		$client = $this->couch_client->getMasterClient('_patients');
		return $this->couch_client->getById($id, Patient::class, $client);
	}

	public function getAll() : array {
		$client = $this->couch_client->getMasterClient('_patients');
		$client->include_docs(true);
		$docs = $client->getAllDocs();

		$result = [];
		if($docs->total_rows > 0) {
			foreach($docs->rows as $row) {
				$result[] = CouchHelper\parseFromDocument($row->doc, Patient::class);
			}
		}

		return $result;
	}
}


class Patient {
	use \Couchhelper\ParsableToCouch;

	public $name;
	public $ssn;
}