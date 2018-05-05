<?php
/**
 * Created by PhpStorm.
 * User: eliasjohnsson
 * Date: 2018-05-03
 * Time: 10:15
 */
require_once("application/third_party/Cql_builder.php");
class Cassandra_client {
	private $session;


	public function __construct() {
	    $host = "127.0.0.1";
	    $port = 9042;
	    $keyspace = "stack2";

        $cluster = Cassandra::cluster()
            ->withContactPoints($host)
            ->withPort($port)
            ->build();

        $this->session = $cluster->connect($keyspace);
    }

    public function select(array $columns) {
	    return new Cql_builder(Cql_builder::SELECT, $columns);
    }

    public function insert(string $table, array $columns){
	    $builder = new Cql_builder(Cql_builder::INSERT, $columns);
        $builder->from($table);
        return $builder;
    }

    public function run(Cql_builder $builder) {
        try {
            $statement = new Cassandra\SimpleStatement((string) $builder);
            $future    = $this->session->executeAsync($statement);
            return $future->get();
        } catch(Exception $e) {
            return null;
        }

    }
}