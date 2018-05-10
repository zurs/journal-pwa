<?php
/**
 * Created by PhpStorm.
 * User: eliasjohnsson
 * Date: 2018-05-03
 * Time: 10:15
 */
class Cassandra_client {
	private $session;


	public function __construct() {
        $ci = &get_instance();
	    $host       = $ci->config->item('host', 'cassandra');
	    $port       = $ci->config->item('port', 'cassandra');
	    $keyspace   = $ci->config->item('keyspace', 'cassandra');

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