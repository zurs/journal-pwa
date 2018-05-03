<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see https://codeigniter.com/user_guide/general/urls.html
	 */
	public function index()
	{

	    $query = $this->cassandra_client
            ->select(['id', 'username', 'password'])
            ->from('stack2.accounts');

	    $result = $this->cassandra_client->run($query);
		//$this->load->view('welcome_message');
		/*$cluster = Cassandra::cluster()
			->withContactPoints("127.0.0.1")
			->withPort(9042)
			->build();
		$keyspace  = 'stack2';
		$session = $cluster->connect($keyspace);*/

		/*$statement = new Cassandra\SimpleStatement(       // also supports prepared and batch statements
			'INSERT INTO stack2.accounts (id, username, password) VALUES (5b6962dd-3f90-4c93-8f61-eabfa4a803e2, \'foo\', \'bar\');'
		);
		$future    = $session->executeAsync($statement);  // fully asynchronous and easy parallel execution
		$result    = $future->get();*/                      // wait for the result, with an optional timeout


		/*$statement = new Cassandra\SimpleStatement(       // also supports prepared and batch statements
			'SELECT id, username, password FROM stack2.accounts;'
		);
		$future    = $session->executeAsync($statement);
		$result    = $future->get();
		*/
		foreach ($result as $row) {                       // results and rows implement Iterator, Countable and ArrayAccess
			printf($row['id']);
		}/**/


	}
}
