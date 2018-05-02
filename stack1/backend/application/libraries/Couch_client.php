<?php

use PHPOnCouch\CouchClient;

class Couch_client {
	private $clients;
	public function __construct(){
		$this->clients = [
			'master' => [],
			'client' => []
		];
	}

	public function getMasterClient(string $database, $create = false) {
		$ci = &get_instance();
		$cfgHost 		= $ci->config->item('host', 'couchdb');
		$cfgPort 		= $ci->config->item('port', 'couchdb');
		$cfgUser 		= $ci->config->item('user', 'couchdb');
		$cfgPassword	= $ci->config->item('password', 'couchdb');

		if(key_exists($database, $this->clients)) {
			return $this->clients['master'][$database];
		} else {
			try{
				$dbUrl = "http://$cfgUser:$cfgPassword@$cfgHost:$cfgPort";
				$client = new CouchClient($dbUrl, $database);
			} catch(Exception $e){
				return null;
			}

			if($create && !$client->databaseExists()){
				$client->createDatabase();
			}

			if($client->databaseExists()){
				$this->clients['master'][$database] = $client;
			} else {
				$client = null;
			}

		}
		return $client;
	}


	public function upsert($parsableObject, CouchClient $client) {
		$response = null;
		try {
			$doc = CouchHelper\parseToDocument($parsableObject, isset($parseableObject->id));
			$response = $client->storeDoc($doc);
		} catch(Exception $e) {
			$response = null;
		}

		if($parsableObject->id){
			$parsableObject->rev = $response->rev;
		}

		if($response !== null) {
			$parsableObject->id = $response->id;
		}
		else {
			$parsableObject = null;
		}

		return $parsableObject;
	}

	public function getById(string $id, string $class, CouchClient $client) {
		try {
			$doc = $client->getDoc($id);
		}
		catch(Exception $e) {
			$doc = null;
		}

		if($doc !== null) {
			return CouchHelper\parseFromDocument($doc, $class);
		}
		return null;
	}


	public function getBySelector(array $selector, string $class, CouchClient $client, $limit = 0) {
		if($limit > 0) {
			$client->limit($limit);
		}

		$docs = $client->find($selector);

		if($limit === 1) {
			$result = null;
			if(count($docs) === 1) {
				$accountDoc = reset($docs);
				$result = CouchHelper\parseFromDocument($accountDoc, $class);
			}

		} else {
			$result = [];
			if(count($docs) > 0) {
				foreach($docs AS $doc) {
					$result[] =  CouchHelper\parseFromDocument($doc, $class);
				}
			}
		}
		return $result;
	}

}