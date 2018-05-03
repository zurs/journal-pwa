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
        $cluster = Cassandra::cluster()// connects to localhost by default
        ->build();
        $keyspace = 'stack2';
        $session = $cluster->connect($keyspace);        // create session, optionally scoped to a keyspace
        $statement = new Cassandra\SimpleStatement(       // also supports prepared and batch statements
            'SELECT * FROM stack2.accounts'
        );
        $future = $session->executeAsync($statement);  // fully asynchronous and easy parallel execution
        $result = $future->get();                      // wait for the result, with an optional timeout

        
    }
}
