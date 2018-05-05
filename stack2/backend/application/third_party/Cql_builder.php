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

        if($this->state === self::INSERT){
	        $query .= 'INSERT INTO ' . $this->table . ' (';

	        // Add the attributes that's gonna be inserted
	        foreach ($this->fields as $index => $field){
	            if($index === (count($this->fields) - 1)){
	                $query .= "{$field}) "; // Add paranthesis and space if it's the last item
                } else {
	                $query .= "{$field}, ";
                }
            }

            $query .= 'VALUES (';
            // Add the actual values
            foreach ($this->values as $index => $value) {

                $tempVal = $value;
                // Check if it isn't an UUID or number // TODO: Add some type checking that actually works reliably(like table metadata)
                if(!$this->isUUID4($tempVal)){
                    var_dump($tempVal);
                    $tempVal = "'{$tempVal}'";
                }

                if($index === (count($this->values) - 1)){
                    $query .= "{$tempVal}) "; // Add paranthesis and space if it's the last item
                } else {
                    $query .= "{$tempVal}, ";
                }
            }
        }

        if($this->limit > 0) {
	        $query .= " LIMIT ".$this->limit;
        }

        if($this->state === $this::SELECT){
            $query .= 'ALLOW FILTERING';
        }

        return $query;
    }

    private function _setValues(array $data, int $state) {
	    foreach($data as $key => $value) {
            $this->fields[] = $key;
            $this->values[] = $value;
        }
	    $this->state = $state;
    }

    private function isUUID4($uuid){
	    $regex = '/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i';
	    return !!count(preg_match($regex, $uuid));
    }


}