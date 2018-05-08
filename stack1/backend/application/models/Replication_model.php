<?php
/**
 * Created by PhpStorm.
 * User: eliasjohnsson
 * Date: 2018-05-08
 * Time: 10:53
 */

class Replication_model extends CI_Model {
	public function __construct() {
		$this->load->library('couch_client');
		$this->load->model('patient_model');
		$this->load->model('account_model');
	}

	public function createReplicationDatabase(Patient $patient, Account $account) : ?string {
		$client = $this->couch_client->getMasterClient('_replicated_patients');
		$row = new ReplicationRow();
		$row->patientId = $patient->id;
		$row->accountId = $account->id;
		// Create dbs
		$this->couch_client->databasePrefix = $account->username;
		$createdPatients = $this->couch_client->getMasterClient("_patients", true);
		$createdJournals = $this->couch_client->getMasterClient("_journals", true);
		$addedData = $this->couch_client->upsert($row, $client);
		if($addedData && $createdJournals && $createdPatients) {
			return $account->username;
		}
		return null;
	}
}

class ReplicationRow {
	use \Couchhelper\ParsableToCouch;

	public $patientId;
	public $accountId;
}