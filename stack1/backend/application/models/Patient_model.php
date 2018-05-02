<?php
/**
 * Created by PhpStorm.
 * User: hampusek
 * Date: 2018-04-27
 * Time: 14:21
 */

use PHPOnCouch\CouchClient;

class Patient_model extends CI_Model {

	function __construct(){
		parent::__construct();
		$this->load->library('couch_client');
	}

	public function create(Patient $patient) : Patient {
		$client = $this->couch_client->getMasterClient('test1_patients');

		$patient = $this->couch_client->upsert($patient, $client);

		return $patient;
	}

	public function getById(string $id) {
		$client = new CouchClient('http://admin:admin@127.0.0.1:5984', 'test1_patients');
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
			$result = Patient::parseFromDocument($doc);
		}
		return $result;
	}

	public function getAll() : array {
		$client = new CouchClient('http://admin:admin@127.0.0.1:5984', 'test1_patients');
		if(!$client->databaseExists()){
			$client->createDatabase();
		}

		$client->include_docs(true);
		$docs = $client->getAllDocs();

		$result = [];
		if($docs->total_rows > 0) {
			foreach($docs->rows as $row) {
				$result[] = Patient::parseFromDocument($row->doc);
			}
		}

		return $result;
	}
}


class Patient {

	use \Couchhelper\ParsableToCouch;

	public $name;
	public $ssn;

	public static function parseToDocument(Patient $patient) : stdClass {
		return CouchHelper\parseToDocument($patient, false);
	}

	public static function parseFromDocument(stdClass $document) : Patient {
		return CouchHelper\parseFromDocument($document, Patient::class);
	}

}