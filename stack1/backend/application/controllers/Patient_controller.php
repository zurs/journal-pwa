<?php
/**
 * Created by PhpStorm.
 * User: hampusek
 * Date: 2018-04-27
 * Time: 14:25
 */
require_once('application/traits/ApiKeyAuthenticated.php');

class Patient_controller extends CI_Controller {

	use ApiKeyAuthenticated;

	function __construct(){
		parent::__construct();
		$this->authenticateRequest();

		$this->load->model('journal_model');
		$this->load->model('patient_model');
		$this->load->model('replication_model');
		$this->load->model('log_model');
		$this->load->library('couch_client');
	}

	public function create(){
		$patient = new Patient();
		$patient->name = $this->input->post('name');
		$patient->ssn = $this->input->post('ssn');

		$result = $this->patient_model->create($patient);

		if($result === null){
			$this->jsonresponse->Error();
		}

		$this->jsonresponse->Ok($result);
	}

	public function get($id) {
		$patient = $this->patient_model->getById($id);
		if($patient === null) {
			$this->jsonresponse->Error("", 404);
		}
		$this->jsonresponse->Ok($patient);
	}

	public function getAll() {
		$patients = $this->patient_model->getAll();
		$this->jsonresponse->Ok($patients);
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
		$this->jsonresponse->Ok($journals);
	}

	public function store($id) {
		$patient = $this->patient_model->getById($id);
		$account = $this->getCurrentAccount();
		if($patient === null) {
			$this->jsonresponse->Error("", 404);
		}
		$journals = $this->journal_model->getByPatientId($id);
		foreach($journals AS $journal) {
			$log = new Log();
			$log->journalId = $journal->id;
			$log->readerId 	= $account->id;
			$this->log_model->create($log);
		}

		$db = $this->replication_model->createReplicationDatabase($patient, $account);
		if($db === null) {
			$this->jsonresponse->Error("", 500);
		}
		$this->patient_model->create($patient);

		foreach($journals AS $journal) {
			$this->journal_model->create($journal);
		}
		$this->jsonresponse->Ok(['patients' => $db."_patients", 'journals' => $db."_journals"]);
	}
}