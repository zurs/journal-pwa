<?php
/**
 * Created by PhpStorm.
 * User: hampusek
 * Date: 2018-04-27
 * Time: 13:37
 */

class Journal_controller extends CI_Controller {

	function __construct() {
		parent::__construct();
		$this->load->model('patient_model');
		$this->load->model('journal_model');
		$this->load->model('account_model');
		$this->load->model('log_model');
	}

	public function create() {
		$journal = new Journal();
		$journal->patientId = $this->input->post('patientId');
		$journal->writtenAt = $this->input->post('writtenAt');
		$journal->text      = $this->input->post('text');

		$apiKey 	= $this->input->post('apiKey');
		$account 	= $this->account_model->getByApiKey($apiKey);

		if($account === null) {
			$this->jsonresponse->Error();
		}

		$journal->authorId = $account->id;
		$patient = $this->patient_model->getById($journal->patientId);

		if($patient === null) {
			$this->jsonresponse->Error("patient does not exist");
		}


		$returnJournal = $this->journal_model->create($journal);
		if($returnJournal === null){
			$this->jsonresponse->Error();
		}

		$this->jsonresponse->Ok($returnJournal);
	}

	public function get($id) {
		$apiKey 	= $this->input->get('apiKey');
		$account 	= $this->account_model->getByApiKey($apiKey);

		if($account === null) {
			$this->jsonresponse->Error();
		}

		$journal = $this->journal_model->getById($id);
		if($journal === null) {
			$this->jsonresponse->Error();
		}

		$log = new Log();
		$log->journalId = $journal->id;
		$log->readerId 	= $account->id;
		$result = $this->log_model->create($log);

		if($result === null)
			$this->jsonresponse->Error();

		$this->jsonresponse->Ok($journal);
	}

	public function getLogs($id) {
		$logs = $this->log_model->getByJournalId($id);

		$formattedLogs = [];
		foreach($logs AS $log) {
			$account = $this->account_model->getById($log->readerId);
			$formattedLogs[] = ['id' => $log->id, 'readBy' => $account->username, 'readAt' => $log->readAt];
		}

		$this->jsonresponse->Ok($formattedLogs);
	}
}