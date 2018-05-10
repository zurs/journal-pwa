<?php

class Log_model extends CI_Model {

    public function __construct() {
        parent::__construct();
    }

    public function create(Log $log): ?Log {
        $query = $this->cassandra_client->insert('logs', (array)$log);
        $result = $this->cassandra_client->run($query);
        if($result === null){
            return null;
        }
        return $log;
    }

    public function getJournalLogs(string $journalId): ?array {
        $logs = $this->cassandra_client->select(['*']);
        if(!$logs){
            return null;
        }

        $returnArray = [];
        foreach ($logs as $log) {
            $returnArray[] = $log;
        }

        return $returnArray;
    }
}

class Log{

    use Cql_Parsable;

    public $readAt;
    public $journalId;
    public $accountId;

}

