<?php

require_once APPPATH . 'controllers/Authenticated_controller.php';

class Journal_controller extends Authenticated_controller {

    function __construct() {
        parent::__construct();
    }

    public function create() {
        $journal = new Journal();
        $journal->patientId = $this->input->post('patientId');
        $journal->writtenAt = $this->input->post('writtenAt');
        $journal->text      = $this->input->post('text');

        $returnJournal = $this->journal_model->create($journal);
        if($returnJournal === null) {
            $this->json_response->Error();
        }

        $this->json_response->Ok($returnJournal);
    }

    public function get($id) {
        $journal = $this->journal_model->get($id);
        if($journal === null) {
            $this->json_response->Error();
        }
        $this->json_response->Ok($journal);
    }

    public function getLogs($journalId) {
        $logs = $this->journal_model->getLogs($journalId);

        if($logs === null){
            $this->json_response->Error('Kunde inte hämta loggar');
        }
        $this->json_response->Ok($logs);
    }
}