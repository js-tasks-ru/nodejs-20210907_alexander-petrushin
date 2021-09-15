const url = require('url');
const fs = require('fs');
const http = require('http');
const path = require('path');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end();
      } else if (fs.existsSync(filepath)) {
        const stream = fs.createReadStream(filepath);
        stream.pipe(res);
        stream.on('error', (err) => {
          res.statusCode = 500;
          res.end();
        });

        req.on('aborted', () => {
          stream.destroy();
        });

        res.statusCode = 200;
      } else if (!fs.existsSync(filepath)) {
        res.statusCode = 404;
        res.end();
      } else {
        res.statusCode = 500;
        res.end();
      }

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
