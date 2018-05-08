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
		$this->load->model('journal_model');
		$this->load->model('account_model');
		$this->load->model('log_model');
	}

	public function create(Patient $patient, Account $account, array $journals) : ?string {
		$row = $this->getById($patient->id);
		if($row === null) {
			$row = new ReplicationRow();
			$row->id = $patient->id;
		}
		$row->addAccount($account->id);

		// Create dbs
		$client = $this->couch_client->getMasterClient('_replicated_patients');
		$oldPrefix = $this->couch_client->databasePrefix;
		$this->couch_client->databasePrefix = $account->username;
		$createdPatients 	= $this->couch_client->getMasterClient("_patients", true);
		$createdJournals 	= $this->couch_client->getMasterClient("_journals", true);
		$addedRow = $this->couch_client->upsert($row, $client);

		$result = null;
		if($addedRow && $createdJournals && $createdPatients) {
			$this->patient_model->create($patient);
			foreach($journals AS $journal) {
				$this->journal_model->create($journal);
			}
			$result = $account->username;
		}
		$this->couch_client->databasePrefix = $oldPrefix;
		return $result;
	}

	public function delete(Patient $patient, Account $account) {
		$row = $this->getById($patient->id);
		$row->removeAccount($account->id);

		$oldPrefix = $this->couch_client->databasePrefix;
		$this->couch_client->databasePrefix = $account->username;

		$storedPatient 	= $this->patient_model->getById($patient->id);
		$storedJournals = $this->journal_model->getByPatientId($patient->id);
		$this->patient_model->delete($storedPatient);
		foreach($storedJournals AS $journal) {
			$this->journal_model->delete($journal);
		}
		$this->couch_client->databasePrefix = $oldPrefix;
		$client = $this->couch_client->getMasterClient('_replicated_patients');
		return $this->couch_client->upsert($row, $client) !== null;
	}

	public function getById(string $patientId) : ?ReplicationRow {
		$client = $this->couch_client->getMasterClient('_replicated_patients');
		$row = $this->couch_client->getById($patientId, ReplicationRow::class, $client);
		if($row === null) {
			return null;
		};
		return $row;
	}
}

class ReplicationRow {
	use \Couchhelper\ParsableToCouch;
	public $accounts;

	public function getAccounts() : array {
		$formatted = [];
		if(isset($this->accounts)) {
			$formatted = json_decode($this->accounts);
		}
		return $formatted;
	}

	public function removeAccount(string $accountId) {
		$accounts = $this->getAccounts();
		$key = array_search($accountId, $accounts);
		if($key !== false) {
			unset($accounts[$key]);
			$this->accounts = json_encode($accounts);
		}
	}

	public function addAccount(string $accountId) {
		$accounts = $this->getAccounts();
		if(!in_array($accountId, $accounts)) {
			$accounts[] = $accountId;
		}
		$this->accounts = json_encode($accounts);
		return $accounts;
	}
}