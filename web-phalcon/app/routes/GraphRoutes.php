<?php
namespace NetAssist\Routes;
use Phalcon\Mvc\Router\Group as RouterGroup;

class GraphRoutes extends RouterGroup
{
    public function initialize()
    {
        $this->setPrefix('/Graph');

        $this->addGet("/fetchAllNodes", "Graph::fetchAllNodes");
        $this->addGet("/fetchAllLinks", "Graph::fetchAllLinks");
    }
}
