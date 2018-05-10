<?php

require_once APPPATH . 'controllers/Authenticated_controller.php';

class Log_controller extends Authenticated_controller {
    public function __construct() {
        parent::__construct();

        $this->load->model('log_model');
    }

    public function sync() {
       $logs = $this->input->post('logs');
       $result = true;
       foreach($logs AS $inputLog) {
           $log = new Log();
           $log->id = \Ramsey\Uuid\Uuid::uuid4();
           $log->journalId  = $inputLog->journalId;
           $log->readAt     = $inputLog->readAt;
           $log->accountId  = $this->current_account->id;
           $result = $result && ($this->log_model->create($log) !== null);
       }

       if($result) {
           $this->json_response->Ok();
       }
      $this->json_response->Error();
    }
}