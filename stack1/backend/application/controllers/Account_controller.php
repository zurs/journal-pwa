<?php
/**
 * Created by PhpStorm.
 * User: hampusek
 * Date: 2018-04-25
 * Time: 10:06
 */

class Account_controller extends CI_Controller{

	public function __construct(){
		parent::__construct();
		$this->load->model('account_model');
	}

	public function login(){

	}

	public function create(){

		$account = new Account();
		$account->username = $this->input->post('username');
		$account->password = $this->input->post('password');

		$account = $this->account_model->create($account);

		if($account !== null){
			exit(json_encode($account));
		} else {
			exit(json_encode(['error' => 'Wrong stiuff']));
		}

	}

	public function update(){

	}

	public function delete(){

	}

	public function get(){

	}

}