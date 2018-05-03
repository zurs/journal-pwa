<?php

class Journal_model extends CI_Model {

    public function create(Journal $journal): Journal {

    }

    public function get(): Journal {

    }

}

class Journal {
    public $patientId;
    public $text;
    public $authorId;
    public $writttenAt;
    public $submittedAt;
}