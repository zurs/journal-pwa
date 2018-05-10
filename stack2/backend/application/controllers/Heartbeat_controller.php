<?php
/**
 * Created by PhpStorm.
 * User: eliasjohnsson
 * Date: 2018-05-10
 * Time: 09:35
 */

class Heartbeat_controller extends CI_Controller {
    public function __construct() {
        parent::__construct();
    }

    public function index() {
        $this->json_response->Ok();
    }
}