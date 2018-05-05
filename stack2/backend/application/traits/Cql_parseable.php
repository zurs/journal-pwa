<?php

trait Cql_Pareseable {

    public $id;

    public static function parseFromDocument($doc){
        $class = get_class();
        $obj = new $class;
        $props = array_keys(get_class_vars($class));

        foreach ($props as $prop){
            if(array_key_exists($prop, $doc)){
                $obj->$prop = $doc[$prop];
            }
        }

        return $obj;
    }
}