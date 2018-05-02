<?php
/**
 * Created by PhpStorm.
 * User: eliasjohnsson
 * Date: 2018-04-27
 * Time: 11:24
 */

namespace CouchHelper {
	function parseToDocument($object, $update = false) : \stdClass {

		if(!(array_key_exists(ParsableToCouch::class, class_uses($object)))) {
			throw new \Exception('$object must use ParsableToCouch');
		}

		$fields = get_object_vars($object);

		$parsedObject = new \stdClass();
		foreach($fields AS $field => $value) {
			$parsedObject->$field = $value;
		}

		$id 	= $parsedObject->id;
		$rev 	= $parsedObject->rev;

		unset($parsedObject->id);
		unset($parsedObject->rev);

		if($update) {
			$parsedObject->_id = $id;
			$parsedObject->_rev = $rev;
		}

		return $parsedObject;
	}

	function parseFromDocument(\stdClass $document, string $class) {

		$fields = get_class_vars($class);
		$object = new $class();



		if(!(array_key_exists(ParsableToCouch::class, class_uses($object)))) {
			throw new \Exception('$class must use ParsableToCouch');
		}

		foreach($fields AS $field => $value) {
			if(isset($document->$field)) {
				$object->$field = $document->$field;
			}
		}

		$object->rev = $document->_rev;
		$object->id = $document->_id;

		return $object;
	}

	trait ParsableToCouch {
		/*
	 	* @var string
	 	*/
		public $id;

		/*
	 	* @var string
		 */
		public $rev;
	}
}