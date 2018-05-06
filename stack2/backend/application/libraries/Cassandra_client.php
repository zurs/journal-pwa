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

    public function select(array $columns) : Cql_builder {
	    return new Cql_builder(Cql_builder::SELECT, $columns);
    }

    public function insert(string $table, array $columns) : Cql_builder {
	    $builder = new Cql_builder(Cql_builder::INSERT, $columns);
        $builder->from($table);
        return $builder;
    }

    public function update(string $table, array $columns) : Cql_builder {
        $builder = new Cql_builder(Cql_builder::UPDATE, $columns);
        $builder->from($table);
        return $builder;
    }

    public function run(Cql_builder $builder) {
	    $result = null;
        try {
            $statement = new Cassandra\SimpleStatement((string) $builder);
            $future    = $this->session->executeAsync($statement);
            $result = $future->get();
        } catch(Exception $e) {
            exit(var_dump($e->getMessage()));
            return null;
        }

        if($builder->getState() === Cql_builder::SELECT) {
            if($result->count() > 0) {
                if($builder->getLimit() === 1) {
                    return $result[0];
                }
                return $result;
            }
            return null;
        }

        return $result;
    }
}