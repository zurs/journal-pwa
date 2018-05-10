<?php
/**
 * Created by PhpStorm.
 * User: hampusek
 * Date: 2018-04-27
 * Time: 14:25
 */

class Patient_controller extends CI_Controller {

	use ApiKeyAuthenticated;

	function __construct(){
		parent::__construct();
		$this->authenticateRequest();
	}

	public function create(){
		$patient = new Patient();
		$patient->name = $this->input->post('name');
		$patient->ssn = $this->input->post('ssn');

		$result = $this->patient_model->create($patient);

		if($result === null){
			$this->json_response->Error();
		}

		$this->json_response->Ok($result);
	}

	public function get($id) {
		$patient = $this->patient_model->getById($id);
		if($patient === null) {
			$this->json_response->Error("", 404);
		}
		$this->json_response->Ok($patient);
	}

	public function getAll() {
		$patients = $this->patient_model->getAll();
		$this->json_response->Ok($patients);
	}

	public function getJournals($id) {
		$journals = $this->journal_model->getByPatientId($id);

		foreach($journals AS $journal) {
			unset($journal->text);
			unset($journal->authorId);
			unset($journal->patientId);
			unset($journal->writtenAt);
			unset($journal->rev);
		}
		$this->json_response->Ok($journals);
	}

	public function create_store($id) {
		$account = $this->getCurrentAccount();
		$db = $this->replication_model->create($id, $account->id, $account->username);

		if($db === null) {
			$this->json_response->Error("could not replicate");
		}
		$this->json_response->Ok(['db' => $account->username]);
	}

	public function delete_store($id) {
		$account = $this->getCurrentAccount();
		$result = $this->replication_model->delete($id, $account->id, $account->username);

		if($result) {
			$this->json_response->Ok();
		}
		$this->json_response->Error("Could not delete", 404);
	}
}