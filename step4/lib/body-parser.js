
const bodyParser = (req, res, next) => {
    const body = '';
    req.on('data', (chunk) => {
      body += chunk;
    }).on('end', () => {
      req.body = parseBody(body)
      next();
    });
};

const parseBody = (body) => {
  const obj = {};
  body.split('&').forEach((str)=>{
    obj[str.split('=')[0]] = str.split('=')[1]
  });
  return obj;
};

module.exports = bodyParser;