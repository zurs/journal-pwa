<?php

use Ramsey\Uuid\Uuid;

class Patient_model extends CI_Model {
    public function __construct(){
        parent::__construct();
    }

    public function create(Patient $patient){
        $query = $this->cassandra_client->insert('patients', [
            'id'    => Uuid::uuid4(),
            'name'  => $patient->name,
            'ssn'   => $patient->ssn
        ]);

        return $this->cassandra_client->run($query);
    }

    public function getById(string $id): Patient {

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