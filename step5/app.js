const express = require('./lib/express');
const path = require('path');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const mimeType = require('./lib/mime');


const app = express();


app.use(urlencodedParser);
app.use(mimeType);
app.use(express.static(path.join(__dirname, 'static')));
app.set('views', path.join(__dirname, 'views'));


app.use( (req, res, next) => {
  console.log('middleware 1');
  next()
});

app.use( (req, res, next) => {
  console.log('middleware 12');
  next()
});


app.use('/hello', (req, res) => {
  console.log('/hello..');
  res.send('hello world');
});

app.use('/getWeather', (req, res) => {
  res.send({url:'/getWeather', city: req.query.city});
});

app.use('/search', (req, res) => {
  res.send(req.body);
});

app.use('/about', (req, res) => {
  res.render('about.html', {
    title: '饥人谷直播14班开班了',
    teacher: '若愚',
    date: '7月中旬',
    intro: 'http://jirengu.com'
  })
});

app.use( (req, res) => {
  res.send(404, 'haha Not Found')
});


module.exports = app
