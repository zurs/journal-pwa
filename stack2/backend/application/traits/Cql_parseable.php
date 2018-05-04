<?php

trait Cql_Pareseable {

    public $id;

    public function parseFromDocument($doc){
        $props = get_object_vars($this);

        foreach ($props as $prop){
            if(array_key_exists($prop, $doc)){
                $this->$prop = $doc[$prop];
            }
        }
    }

    public function parseToDocuemnt(): array {
        $props = get_object_vars($this);

        $doc = [];

        foreach ($props as $prop){
            if(array_key_exists($prop, $doc)){
                $doc[$prop] = $this->$prop;
            }
        }
    }

}