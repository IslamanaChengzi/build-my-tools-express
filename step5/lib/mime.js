
const url = require('url');
const mime = require('mime-types');

const Mime = (req, res, next) => {
  const pathObj = url.parse(req.url, true);
  const mimeType = mime.lookup(pathObj.pathname);
  console.log(mimeType);
  res.setHeader('content-type', mimeType);
  next();
};

module.exports = Mime;