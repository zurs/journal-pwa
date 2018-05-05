<?php
/**
 * Created by PhpStorm.
 * User: eliasjohnsson
 * Date: 2018-05-03
 * Time: 10:35
 */
class Cql_builder {
	const SELECT	= 0;
	const INSERT	= 1;
	const UPDATE	= 2;
	const DELETE	= 3;
	const DROP		= 4;

	private $where = [];
	private $fields = [];
	private $values = [];
	private $table;
	private $joins = [];
	private $limit = 0;

	private $state;

	public function __construct(int $state, $data) {
	    $this->state = $state;
        switch($this->state) {
            case self::SELECT:
                $this->select($data);
                break;
            case self::INSERT:
                $this->insert($data);
                break;
            case self::UPDATE:
                $this->update($data);
                break;
            case self::DELETE:
                $this->delete($data);
                break;
            case self::DROP:
                $this->drop($data);
                break;
            default:
                throw new Exception('$state is not implemented, see constants in application/third_party/Cql_builder.php');
        }
    }

	public function join(string $table, string $on) : Cql_builder {
	    $this->joins[] = [$table, $on];
	    return $this;
    }

	public function where($key, $value) : Cql_builder {
	    $this->where[] = [$key, $value];
	    return $this;
    }

	public function from(string $table) : Cql_builder {
	    $this->table = $table;
	    return $this;
    }

    public function limit(int $limit) : Cql_builder {
	    if($limit < 0) {
            throw new Exception('$limit must be integer > 0');
        }

	    $this->limit = $limit;

	    return $this;
    }

    private function select(array $fields) {
        $this->state = self::SELECT;
        $this->fields = $fields;
    }

    private function insert(array $data) {
        $this->_setValues($data, self::INSERT);
    }

    private function update(array $data) {
        $this->_setValues($data, self::UPDATE);
    }

    private function delete(array $data) {
	    $this->_setValues($data, self::DELETE);
    }

    private function drop(string $table) {
	    $this->state = self::DROP;
	    $this->table = $table;
    }

    public function __toString() {
	    $query = "";
	    if($this->state === self::SELECT) {
            $query .= "SELECT ".implode(", ", $this->fields). " ";
            $query .= "FROM ".$this->table." ";
        }

        if(!empty($this->where)) {
	        $query .= "WHERE ";
            $whereArr = [];
	        foreach($this->where AS $tuple) {
	            $column = $tuple[0];
	            $value  = $tuple[1];


	            if(is_string($value)) {
                    $value = '\''.$value.'\'';
                }

	            $whereArr[] = "$column = $value";
            }
            $query .= implode(" AND ", $whereArr)." ";
        }

        if($this->limit > 0) {
	        $query .= " LIMIT ".$this->limit;
        }

        $query .= 'ALLOW FILTERING';

        return $query;
    }

    private function _setValues(array $data, int $state) {
	    foreach($data as $key => $value) {
            $this->fields[] = $key;
            $this->values[] = $value;
        }
	    $this->state = $state;
    }


}