<?php

class Patient_model extends CI_Model {
    public function __construct(){
        parent::__construct();
    }

    public function create(Patient $patient){

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