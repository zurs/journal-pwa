<?php

class Authenticated_controller extends CI_Controller {

    public function __construct(){
        parent::__construct();
        $this->load->library('current_account');
    }
}