<?php
/**
 * Created by PhpStorm.
 * User: hampusek
 * Date: 2018-04-27
 * Time: 14:25
 */

class Patient_controller extends CI_Controller {

	function __construct()
	{
		parent::__construct();
		$this->load->model('patient_model');
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

	public function get($id){

	}

}