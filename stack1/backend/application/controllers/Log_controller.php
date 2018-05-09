<?php
/**
 * Created by PhpStorm.
 * User: eliasjohnsson
 * Date: 2018-05-09
 * Time: 10:46
 */
require_once('application/traits/ApiKeyAuthenticated.php');
class Log_controller extends CI_Controller {
	use ApiKeyAuthenticated;

	public function __construct() {
		parent::__construct();
		$this->authenticateRequest();
		$this->load->model('log_model');
	}

	public function sync() {
		$postedLogs = $this->input->post('logs');

		$result = false;
		foreach($postedLogs AS $postedLog) {
			$log = new Log();
			$log->journalId = $postedLog->journalId;
			$log->readerId	= $this->getCurrentAccount()->id;
			$log->readAt	= $postedLog->readAt;
			$result = $this->log_model->create($log) !== null;
		}

		if($result) {
			$this->jsonresponse->Ok();
		}
		$this->jsonresponse->Error();
	}
}