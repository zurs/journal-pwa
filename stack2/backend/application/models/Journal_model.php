<?php

use Ramsey\Uuid\Uuid;

class Journal_model extends CI_Model {

    public function __construct(){
        $this->load->model('account_model');
        $this->load->model('patient_model');
        $this->load->model('log_model');
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

        $newLog = new Log();
        $newLog->accountId = $this->current_account->id;
        $newLog->journalId = $journalId;
        $newLog->readAt = date('Y-m-d H:i:s');
        $newLog->id = Uuid::uuid4();

        $newLog = $this->log_model->create($newLog);


        if(!$newLog){
            return null;
        }

        return Journal::parseFromDocument($result);
    }

    public function getLogs(string $journalId): array {
        $query = $this->cassandra_client
            ->select(['*'])
            ->where('journalId', $journalId)
            ->from('logs');

        $result = $this->cassandra_client->run($query);
        if(!$result){
            return null;
        }

        $returnLogs = [];
        foreach ($result as $log){
            $returnLogs[] = Log::parseFromDocument($log);
        }

        return $returnLogs;
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