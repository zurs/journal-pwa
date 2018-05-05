<?php

class Patient_controller extends CI_Controller {
    public function __construct(){
        parent::__construct();
        $this->load->model('patient_model');
    }

    public function create(){
        $patient = new Patient();
        $patient->name = $this->input->post('name');
        $patient->ssn = $this->input->post('ssn');

        $patient = $this->patient_model->create($patient);

        if(!$patient){
            $this->json_response->Error('Kunde inte skapa patient');
        }
        // This should return a patient object with the id
        $this->json_response->Ok($patient);
    }

    public function get($id){
        $patient = $this->patient_model->get($id);
        if(!$patient){
            $this->json_response->Error('Kunde inte hämta patienten');
        }
        $this->json_response->Ok($patient);
    }

    public function getAll(){
        $patients = $this->patient_model->getAll();
        $this->json_response->Ok($patients);
    }

    public function getJournals($patientId){
        $journals = $this->patient_model->getJournals($patientId);
        $this->json_response->Ok($journals);
    }

}
