const url = require('url');
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end();
      } else {
        fs.unlink(filepath, (e) => {
          if (!e) {
            res.statusCode = 200;
            res.end('file was deleted');
          } else {
            if (e.code === 'ENOENT') {
              res.statusCode = 404;
              res.end('file not found');
            } else {
              res.statusCode = 500;
              res.end('internal error');
            }
          }
        });
      }

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
