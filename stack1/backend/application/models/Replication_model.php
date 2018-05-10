<?php
/**
 * Created by PhpStorm.
 * User: eliasjohnsson
 * Date: 2018-05-08
 * Time: 10:53
 */

class Replication_model extends CI_Model {
	const DB = 'replicated_patients';
	public function __construct() {
		parent::__construct();
	}

	public function create(string $patientId, string $accountId, string $prefix) : bool {
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

		$client 	= $this->couch_client->getMasterClient(self::DB);
		// Create dbs
		$this->couch_client->setPrefix($prefix);

		$createdPatients 	= $this->couch_client->getMasterClient(Patient_model::DB, true);
		$createdJournals 	= $this->couch_client->getMasterClient(Journal_model::DB, true);
		$addedRow 			= $this->couch_client->upsert($row, $client);

		$result = false;
		if($addedRow && $createdJournals && $createdPatients) {
			// Create documents
			$this->patient_model->create($patient);
			foreach($journals AS $journal) {
				$this->journal_model->create($journal);
			}
			$result = true;
		}
		$this->couch_client->resetPrefix();
		return $result;
	}

	public function createJournal(string $patientId, Journal $journal) : bool {
		$row = $this->getById($patientId);
		if($row === null) {
			return true;
		}

		$accountIds = $row->getAccounts();
		$accounts 	= [];
		foreach($accountIds AS $accountId) {
			$accounts[] = $this->account_model->getById($accountId);
		}
		$result 	= false;

		foreach($accounts AS $account) {
			$this->couch_client->setPrefix($account->username);
			$result = $this->journal_model->create($journal) !== null;
		}
		$this->couch_client->resetPrefix();
		return $result;
	}

	public function delete(string $patientId, string $accountId, string $prefix) : bool {
		$row = $this->getById($patientId);
		if($row === null) {
			return true;
		}

		$row->removeAccount($accountId);
		$this->couch_client->setPrefix($prefix);

		$patient 	= $this->patient_model->getById($patientId);
		$journals 	= $this->journal_model->getByPatientId($patientId);

		$this->patient_model->delete($patient);
		foreach($journals AS $journal) {
			$this->journal_model->delete($journal);
		}

		$this->couch_client->resetPrefix();

		$client = $this->couch_client->getMasterClient(self::DB);
		$result = null;
		$accounts = $row->getAccounts();
		if(count($accounts) < 1) {
			return $this->couch_client->delete($row, $client) !== null;
		}
		return $this->couch_client->upsert($row, $client) !== null;
	}

	public function getById(string $patientId) : ?ReplicationRow {
		$client = $this->couch_client->getMasterClient(self::DB);
		$row = $this->couch_client->getById($patientId, ReplicationRow::class, $client);
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