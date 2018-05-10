<?php
/**
 * Created by PhpStorm.
 * User: hampusek
 * Date: 2018-04-27
 * Time: 13:37
 */
require "Authenticated_controller.php";
class Journal_controller extends Authenticated_controller {

	function __construct() {
		parent::__construct();
	}

	public function create() {
		$journal = new Journal();
		$id = $this->input->post('id');
		if($id !== null) {
			$journal->id = $id;
		}
		$journal->patientId = $this->input->post('patientId');
		$journal->writtenAt = $this->input->post('writtenAt');
		$journal->text      = $this->input->post('text');


		$journal->authorId = $this->current_account->id;
		$patient = $this->patient_model->getById($journal->patientId);

		if($patient === null) {
			$this->json_response->Error("patient does not exist");
		}

		$returnJournal = $this->journal_model->create($journal);
		if($returnJournal === null) {
			$this->json_response->Error();
		}
		$this->replication_model->createJournal($patient->id, $returnJournal);
		$this->json_response->Ok($returnJournal);
	}

	public function get($id) {
		$journal = $this->journal_model->getById($id);
		if($journal === null) {
			$this->json_response->Error();
		}

		$log = new Log();
		$log->journalId = $journal->id;
		$log->readerId 	= $this->current_account->id;
		$result = $this->log_model->create($log);

		if($result === null) {
			$this->json_response->Error();
		}

		$this->json_response->Ok($journal);
	}

	public function getLogs($id) {
		$logs = $this->log_model->getByJournalId($id);

		$formattedLogs = [];
		foreach($logs AS $log) {
			$account = $this->account_model->getById($log->readerId);
			$formattedLogs[] = ['id' => $log->id, 'readBy' => $account->username, 'readAt' => $log->readAt];
		}

		$this->json_response->Ok($formattedLogs);
	}
}