<?php

class Journal_controller extends CI_Controller {

    function __construct() {
        parent::__construct();

        $this->load->model('journal_model');
    }

    public function create() {
        $journal = new Journal();
        $journal->patientId = $this->input->post('patientId');
        $journal->writtenAt = $this->input->post('writtenAt');
        $journal->text      = $this->input->post('text');

        $returnJournal = $this->journal_model->create($journal);
        if($returnJournal === null) {
            $this->jsonresponse->Error();
        }

        $this->jsonresponse->Ok($returnJournal);
    }

    public function get($id) {
        $journal = $this->journal_model->getById($id);
        if($journal === null) {
            $this->jsonresponse->Error();
        }

        $this->jsonresponse->Ok($journal);
    }
}