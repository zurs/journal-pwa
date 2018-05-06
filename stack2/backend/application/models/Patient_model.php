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

        return $this->cassandra_client->run($query);
    }

    public function getAll(): array {

    }

    public function getJournals(): array {

    }
}


class Patient {
    public $name;
    public $ssn;
}