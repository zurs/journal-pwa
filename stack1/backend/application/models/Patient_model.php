<?php
/**
 * Created by PhpStorm.
 * User: hampusek
 * Date: 2018-04-27
 * Time: 14:21
 */

use PHPOnCouch\CouchClient;

class Patient_model extends CI_Model {

	public function create(Patient $patient) : Patient {
		$client = new CouchClient('http://admin:admin@127.0.0.1:5984', 'test1_patients');
		if(!$client->databaseExists()) {
			$client->createDatabase();
		}

		$response = null;
		try {
			$response = $client->storeDoc(Patient::parseToDocument($patient));
		} catch(Exception $e) {
			$response = null;
		}

		if($response !== null) {
			$patient->id = $response->id;
		}
		else {
			$patient = null;
		}

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