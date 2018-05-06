<?php

use Ramsey\Uuid\Uuid;

class Patient_model extends CI_Model {
    public function __construct(){
        parent::__construct();
    }

    public function create(Patient $patient){
        $patient->id = Uuid::uuid4();
        $query = $this->cassandra_client->insert('patients', [
            'id'    => $patient->id,
            'name'  => $patient->name,
            'ssn'   => $patient->ssn
        ]);

        if($this->cassandra_client->run($query)) {
            return $patient;
        }
        return null;
    }

    public function getById(string $id) {
        $query = $this->cassandra_client
            ->select(['*'])
            ->from('patients')
            ->where('id', $id)
            ->limit(1);

        $result = $this->cassandra_client->run($query);
        if($result !== null) {
            return Patient::parseFromDocument($result);
        }
        return null;
    }

    public function getAll(): array {
        $query = $this->cassandra_client
            ->select(['*'])
            ->from('patients');

        $result     = $this->cassandra_client->run($query);
        $patients   = [];
        if($result !== null) {
            foreach($result AS $row) {
                $patients[] = Patient::parseFromDocument($row);
            }
        }
        return $patients;
    }

    public function getJournals(): array {

    }
}


class Patient {
    use Cql_Parsable;

    public $name;
    public $ssn;
}