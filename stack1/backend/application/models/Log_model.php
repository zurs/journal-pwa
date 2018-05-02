<?php
/**
 * Created by PhpStorm.
 * User: eliasjohnsson
 * Date: 2018-04-30
 * Time: 14:34
 */
use PHPOnCouch\CouchClient;

class Log_model extends CI_Model {
	public function __construct() {
		parent::__construct();
	}

	public function create(Log $log): Log {
		$client = $this->couch_client->getMasterClient('test1_logs');
		$log->readAt = time();
		return $this->couch_client->upsert($log, $client);
	}

	public function getByJournalId($journalId) : array {
		$client = $this->couch_client->getMasterClient('test1_logs');
		return $this->couch_client->getBySelector(['journalId' => $journalId], Log::class, $client);
	}
}

class Log {
	use \CouchHelper\ParsableToCouch;

	public $journalId;
	public $readerId;
	public $readAt;
}