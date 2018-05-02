<?php
/**
 * Created by PhpStorm.
 * User: hampusek
 * Date: 2018-04-27
 * Time: 13:37
 */
require_once('application/traits/ApiKeyAuthenticated.php');

class Journal_controller extends CI_Controller {

	use ApiKeyAuthenticated;

	function __construct() {
		parent::__construct();
		$this->authenticateRequest();

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


		$journal->authorId = $this->getCurrentAccount()->id;
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
		$journal = $this->journal_model->getById($id);
		if($journal === null) {
			$this->jsonresponse->Error();
		}

		$log = new Log();
		$log->journalId = $journal->id;
		$log->readerId 	= $this->getCurrentAccount()->id;
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