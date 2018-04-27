<?php

use PHPOnCouch\CouchClient;

class Couch_client {

	private $clients;

	private $username = 'admin';
	private $password = 'admin';
	private $address  = '127.0.0.1:5984';

	function __construct(){
		$this->clients = [
			'master' => [],
			'client' => []
		];
	}

	function getMasterClient(string $dbname, $create = false) : CouchClient {
		if(key_exists($dbname, $this->clients)){
			return $this->clients['master'][$dbname];
		} else {
			try{
				$dbUrl = "http://".$this->username.":".$this->password."@".$this->address;
				$client = new CouchClient($dbUrl, $dbname);
			} catch(Exception $e){
				return null;
			}

			if($create && !$client->databaseExists()){
				$client->createDatabase();
			} else if(!$client->databaseExists()){
				return null;
			}

			$this->clients['master'][$dbname] = $client;
		}
		return $client;
	}


	function upsert($parseableObject, $client){

		$className = get_class($parseableObject);

		$response = null;
		try {
			$update = !!$parseableObject->id;
			$doc = $className::parseToDocument($parseableObject, $update);
			$response = $client->storeDoc($doc);
		} catch(Exception $e) {
			$response = null;
		}

		if($parseableObject->id){
			$parseableObject->rev = $response->rev;
		}

		if($response !== null) {
			$parseableObject->id = $response->id;
		}
		else {
			$parseableObject = null;
		}

		return $parseableObject;
	}

}