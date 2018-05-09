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

	public function create(string $patientId, string $accountId, string $db) : bool {
		$patient = $this->patient_model->getById($patientId);
		if($patient === null) {
			return false;
		}
		$journals = $this->journal_model->getByPatientId($patientId);

		$logs  = [];
		foreach($journals AS $journal) {
			$l = $this->log_model->getByJournalId($journal->id);
			$logs = array_merge($logs, $l);
		}

		$row = $this->getById($patientId);
		if($row === null) {
			$row = new ReplicationRow();
			$row->id = $patientId;
		}
		$row->addAccount($accountId);

		$client 	= $this->couch_client->getMasterClient('_replicated_patients');
		// Create dbs
		$oldPrefix 	= $this->couch_client->databasePrefix;
		$this->couch_client->databasePrefix = $db;

		$createdPatients 	= $this->couch_client->getMasterClient("_patients", true);
		$createdJournals 	= $this->couch_client->getMasterClient("_journals", true);
		$createdLogs		= $this->couch_client->getMasterClient("_logs", true);
		$addedRow 			= $this->couch_client->upsert($row, $client);

		$result = false;
		if($addedRow && $createdJournals && $createdPatients && $createdLogs) {
			// Create documents
			$this->patient_model->create($patient);
			foreach($journals AS $journal) {
				$this->journal_model->create($journal);
			}

			foreach($logs AS $log) {
				$this->log_model->create($log);
			}
			$result = true;
		}
		$this->couch_client->databasePrefix = $oldPrefix;
		return $result;
	}

	public function createJournal(string $patientId, Journal $journal) : bool {
		return $this->_create($patientId, $this->journal_model, $journal);
	}

	public function createLog(string $patientId, Log $log) : bool {
		return $this->_create($patientId, $this->log_model, $log);
	}

	public function delete(string $patientId, string $accountId, string $db) : bool {
		$row = $this->getById($patientId);
		if($row === null) {
			return true;
		}

		$row->removeAccount($accountId);

		$oldPrefix = $this->couch_client->databasePrefix;
		$this->couch_client->databasePrefix = $db;

		$patient 	= $this->patient_model->getById($patientId);
		$journals 	= $this->journal_model->getByPatientId($patientId);
		$logs		= [];
		foreach($journals AS $journal) {
			$l = $this->log_model->getByJournalId($journal->id);
			$logs = array_merge($logs, $l);
		}

		$this->patient_model->delete($patient);
		foreach($journals AS $journal) {
			$this->journal_model->delete($journal);
		}
		foreach($logs AS $log) {
			$this->log_model->delete($log);
		}

		$this->couch_client->databasePrefix = $oldPrefix;
		$client = $this->couch_client->getMasterClient('_replicated_patients');
		return $this->couch_client->upsert($row, $client) !== null;
	}

	public function getById(string $patientId) : ?ReplicationRow {
		$client = $this->couch_client->getMasterClient('_replicated_patients');
		$row = $this->couch_client->getById($patientId, ReplicationRow::class, $client);
		return $row;
	}

	private function _create(string $patientId, CI_Model $model, $parsableObject) : bool {
		$row = $this->getById($patientId);
		if($row === null) {
			return true;
		}

		$accountIds = $row->getAccounts();
		$accounts = [];
		foreach($accountIds AS $accountId) {
			$accounts[] = $this->account_model->getById($accountId);
		}

		$oldPrefix 	= $this->couch_client->databasePrefix;
		$result = false;

		foreach($accounts AS $account) {
			$this->couch_client->databasePrefix = $account->username;
			$result = $model->create($parsableObject) !== null;
		}
		$this->couch_client->databasePrefix = $oldPrefix;
		return $result;
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