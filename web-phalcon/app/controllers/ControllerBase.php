<?php

use Phalcon\Mvc\Controller;

class ControllerBase extends Controller
{
  /**
  * Appends error message to the form fields
  * @param string $field Name of form field
  * @param string $error_message Message to append
  * @param Phalcon\Forms\Form|null Form to append, use current view form if null
  * @return void
  */
  public function appendFormFieldError($field, $error_message, $form=null){
    if($form == null){
        $form = $this->view->form;
    }
    $msg_group = $form->getMessagesFor($field);
    $msg_group->appendMessage(new \Phalcon\Validation\Message($error_message));
  }

  public function initialize(){
      $config = $this->di->get('config');
      $this->tag->setTitle(sprintf("[%s] NetGraphz2", $config->information->companyName));
  }

  public function beforeExecuteRoute($dispatcher)
  {
         $identity = $this->auth->getIdentity();
         // If there is no identity available the user is redirected to index/index
         if (!is_array($identity) &&
            $this->cookies->has('RMT') &&
            $this->cookies->has('RMU')) {
              $this->auth->loginWithRememberMe();
              return false;
        }
  }

  protected function _registerSession($user)
  {
    $this->session->set(
         'auth',
         array(
             'id'   => $user->_id,
             'name' => $user->login
         )
     );
  }

  protected function sendJsonResponse($json, $code = 200){
      $this->response->setStatusCode($code);
      $this->response->setJsonContent($json);
      $this->response->setContentType('application/json');
      $this->response->send();
  }
 
}
