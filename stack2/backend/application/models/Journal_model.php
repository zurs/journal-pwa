<?php

use Ramsey\Uuid\Uuid;

class Journal_model extends CI_Model {

    public function __construct(){
        $this->load->model('account_model');
        $this->load->model('patient_model');
    }

    public function create(Journal $journal): ?Journal {

        $accountId = $this->current_account->id;
        $patientId = $this->patient_model->getById($journal->patientId);
        if(!$accountId || !$patientId){
            return null;
        }

        $journal->authorId = $accountId;
        $journal->submittedAt = time() * 1000;
        $journal->id = Uuid::uuid4();

        $query = $this->cassandra_client
            ->insert('journals', (array)$journal);

        if(!$this->cassandra_client->run($query)){
            return null;
        }
        return $journal;

    }

    public function get(string $journalId): ?Journal {
        $query = $this->cassandra_client
            ->select(['*'])
            ->from('journals')
            ->where('id', $journalId)
            ->limit(1);

        $result = $this->cassandra_client->run($query);
        if(!$result){
            return null;
        }
        return Journal::parseFromDocument($result);
    }

}

class Journal {

    use Cql_Parsable;

    public $patientId;
    public $text;
    public $authorId;
    public $writtenAt;
    public $submittedAt;
}