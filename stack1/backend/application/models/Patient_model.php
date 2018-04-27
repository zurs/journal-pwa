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