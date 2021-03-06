<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	https://codeigniter.com/user_guide/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There are three reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router which controller/method to use if those
| provided in the URL cannot be matched to a valid route.
|
|	$route['translate_uri_dashes'] = FALSE;
|
| This is not exactly a route, but allows you to automatically route
| controller and method names that contain dashes. '-' isn't a valid
| class or method name character, so it requires translation.
| When you set this option to TRUE, it will replace ALL dashes in the
| controller and method URI segments.
|
| Examples:	my-controller/index	-> my_controller/index
|		my-controller/my-method	-> my_controller/my_method
*/
$route['default_controller']    = 'welcome';
$route['404_override']          = '';
$route['translate_uri_dashes']  = FALSE;

$route['account/login']['post']  	= 'account_controller/login';
$route['account']['post']       	= 'account_controller/create';
$route['account/db']['get']         = 'authenticated_controller/getDb';

$route['journal']['post'] 				= 'journal_controller/create';
$route['journal/(:any)']['get']			= 'journal_controller/get/$1';
$route['journal/(:any)/logs']['get']	= 'journal_controller/getLogs/$1';

$route['patient']['post'] 					= 'patient_controller/create';
$route['patient/(:any)']['get']				= 'patient_controller/get/$1';
$route['patient']['get']					= 'patient_controller/getAll';
$route['patient/(:any)/journals']['get']	= 'patient_controller/getJournals/$1';
$route['patient/(:any)/store']['post']		= 'patient_controller/create_store/$1';
$route['patient/(:any)/store']['delete']	= 'patient_controller/delete_store/$1';

$route['log/sync']['post']					= 'log_controller/sync';

$route['heartbeat']['get']                  = 'heartbeat_controller/index';
