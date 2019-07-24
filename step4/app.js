const express = require('./lib/express');
const path = require('path');
const bodyParser = require('./lib/body-parser');
const app = express();

app.use(bodyParser);

app.use(express.static(path.join(__dirname, 'static')));

app.use((req, res, next)=>{
  console.log('middleware 1');
  next();
});

app.use((req, res, next)=>{
  console.log('middleware 12');
  next();
});

app.use('/hello',(req, res)=>{
  console.log('/hello..');
  res.send('hello world');
});

app.use('/getWeather',(req, res)=>{
  res.send({url:'/getWeather', city: req.query.city});
});

app.use('/search',(req, res)=>{
  res.send(req.body);
});

app.use((req, res)=>{
  res.send(404, 'haha Not Found');
});

module.exports = app;