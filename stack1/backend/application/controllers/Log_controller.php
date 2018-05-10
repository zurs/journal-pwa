<?php
/**
 * Created by PhpStorm.
 * User: eliasjohnsson
 * Date: 2018-05-09
 * Time: 10:46
 */
require "Authenticated_controller.php";
class Log_controller extends Authenticated_controller {

	public function __construct() {
		parent::__construct();
	}

	public function sync() {
		$postedLogs = $this->input->post('logs');

		$result = false;
		foreach($postedLogs AS $postedLog) {
			$log = new Log();
			$log->journalId = $postedLog->journalId;
			$log->readerId	= $this->current_account->id;
			$log->readAt	= $postedLog->readAt;
			$result = $this->log_model->create($log) !== null;
		}

		if($result) {
			$this->json_response->Ok();
		}
		$this->json_response->Error();
	}
}