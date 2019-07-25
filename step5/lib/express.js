const url = require('url');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const express = () => {
  const tasks = [];
  const app = function(req, res){
    addQuery(req, res);
    addSend(req, res);
    addRender(req, res, app);
    const i = 0;
    const next = () => {
      const task = tasks[i++];
      if(!task) {
        return;
      };
      if(task.routePath === null || url.parse(req.url, true).pathname === task.routePath){
        task.middleWare(req, res, next);
      }else{
        next();
      };
    };
    next();
  };
  app.use = (routePath, middleWare) => {
    if(typeof routePath === 'function') {
      middleWare = routePath;
      routePath = null;
    };
    tasks.push({
      routePath: routePath,
      middleWare: middleWare
    });
  };
  app.data = {};
  app.set = (key, value) => {
    app.data[key] = value;
  };
  app.get = (key) => {
    return app.data[key]
  };
  return app;
};

express.static = (staticPath) => {
  return (req, res, next) => {
    const pathObj = url.parse(req.url, true);
    const filePath = path.resolve(staticPath, pathObj.pathname.substr(1));
    fs.readFile(filePath,'binary', function(err, content){
      if(err){
        next();
      }else {
        res.writeHead(200, 'Ok');
        res.write(content, 'binary');
        res.end();        
      };
    });
  };
};

module.exports = express;

const addQuery = (req, res) => {
  const pathObj = url.parse(req.url, true);
  req.query = pathObj.query;
}

const addSend = (req, res) => {
  res.send = (toSend) => {
    if(typeof toSend === 'string'){
      res.end(toSend);
    };
    if(typeof toSend === 'object'){
      res.end(JSON.stringify(toSend));
    };
    if(typeof toSend === 'number'){
      res.writeHead(toSend, arguments[1]);
      res.end();
    };
  };
};

const addRender = (req, res, app) => {
  res.render = (tplPath, data) => {
    const fullpath = path.join(app.get('views'), tplPath); 
    ejs.renderFile(fullpath, data, {}, function(err, str){
      if(err){
        res.writeHead(503, 'System error');
        res.end();
      }else {
        res.setHeader('content-type', 'text/html');
        res.writeHead(200, 'Ok');
        res.write(str);
        res.end();   
      };
    });
  };
};



