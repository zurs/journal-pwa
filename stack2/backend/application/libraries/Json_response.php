<?php

class Json_response {

    public const CONTENT_TYPE_JSON = 'application/json';
    public const HTTP_OK = 200;
    public const HTTP_ERROR = 400;

    private $ci;

    public function __construct(){
        $this->ci = &get_instance();
    }

    public function Ok($data = null, $exit = true){
        $this->_createResponse($data, self::HTTP_OK, self::CONTENT_TYPE_JSON, $exit);
    }

    public function Error($data = null, $exit = true){
        if(is_string($data)){ // Omvandla till array med ett felmeddelande om $data endast är en sträng
            $data = ['error' => $data];
        }
        $this->_createResponse($data, self::HTTP_ERROR, self::CONTENT_TYPE_JSON, $exit);
    }

    private function _createResponse($data = null, $status = self::HTTP_OK, $contentType = self::CONTENT_TYPE_JSON, $exit = true){
        $this->_setHeaders($status, $contentType);
        $json = null;

        if($data != null){
            $json = $this->_parseJson($data);
        }

        if($exit){
            $this->ci->output->set_output($json);
            $this->ci->output->_display();
            exit();
        }

        return $json;
    }

    private function _setHeaders($status = self::HTTP_OK, $contentType = self::CONTENT_TYPE_JSON){
        $this->ci->output->set_status_header($status);
        $this->ci->output->set_content_type($contentType);
    }

    private function _parseJson($data){
        return json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
}