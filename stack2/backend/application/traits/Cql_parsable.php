<?php

trait Cql_Parsable {

    public $id;

    public static function parseFromDocument($doc){
        $class = get_class();
        $obj = new $class;
        $props = array_keys(get_class_vars($class));

        foreach ($props as $prop) {
            if(isset($doc[strtolower($prop)])) {
                $obj->$prop = "".$doc[strtolower($prop)];
            }
        }

        return $obj;
    }
}