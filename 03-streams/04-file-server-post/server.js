const url = require('url');
const http = require('http');
const path = require('path');
const LimitSizeStream = require('./LimitSizeStream');
const fs = require('fs');
const {EEXIST} = require('constants');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end();
      } else {
        const limitedStream = new LimitSizeStream({limit: 1e6}); // 1 Мегабайт

        const writeStream = fs.createWriteStream(filepath, {
          flags: 'wx',
        });

        writeStream.on('error', (err) => {
          if (err.code === 'EEXIST') {
            res.statusCode = 409;
            res.end('file already exists');
            return;
          }
          res.statusCode = 500;
          res.end();
        });

        writeStream.on('finish', () => {
          res.statusCode = 201;
          res.end('file saved');
        });

        req.pipe(limitedStream).pipe(writeStream);

        limitedStream.on('error', (err) => {
          if (err.code === 'LIMIT_EXCEEDED') {
            // fs.rmSync(filepath, { force: true });
            res.statusCode = 413;
            res.end();
            fs.unlink(filepath, (err) => {
              if (err) throw err;
              console.log(`${filepath} was deleted`);
            });
            return;
          }
          res.statusCode = 500;
          res.end();
        });

        req.on('aborted', () => {
          limitedStream.destroy();
          writeStream.destroy();
          fs.unlink(filepath, (e) => {
            console.log(
                'Соединение было прервано, файл не сохранён',
                e.message,
            );
          });
        });

        req.on('error', (error) => {
          console.log(error);
        });
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
