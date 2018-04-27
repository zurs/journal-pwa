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

}