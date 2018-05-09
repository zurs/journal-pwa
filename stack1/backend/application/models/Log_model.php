<?php
/**
 * Created by PhpStorm.
 * User: eliasjohnsson
 * Date: 2018-04-30
 * Time: 14:34
 */
use PHPOnCouch\CouchClient;

class Log_model extends CI_Model {
	const DB = 'logs';
	public function __construct() {
		parent::__construct();
	}

	public function create(Log $log): ?Log {
		$client = $this->couch_client->getMasterClient(self::DB);
		$log->readAt = time();
		return $this->couch_client->insert($log, $client);
	}

	public function delete(Log $log) : bool {
		$client = $this->couch_client->getMasterClient(self::DB);
		return $this->couch_client->delete($log, $client);
	}

	public function getByJournalId($journalId) : array {
		$client = $this->couch_client->getMasterClient(self::DB);
		return $this->couch_client->getBySelector(['journalId' => $journalId], Log::class, $client);
	}
}

class Log {
	use \CouchHelper\ParsableToCouch;

	public $journalId;
	public $readerId;
	public $readAt;
}