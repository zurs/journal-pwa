<?php

require_once APPPATH . 'controllers/Authenticated_controller.php';

class Log_controller extends Authenticated_controller {
    public function __construct() {
        parent::__construct();

        $this->load->model('log_model');
    }

    public function sync() {
       $logs = $this->input->post('logs');
       $result = false;
       foreach($logs AS $log) {
           $result = $this->log_model->create($log);
       }

       if($result) {
           $this->json_response->Ok();
       }
       $this->json_response->Error();
    }
}