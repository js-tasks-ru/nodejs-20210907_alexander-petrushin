const stream = require("stream");
const LimitExceededError = require("./LimitExceededError");

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.totalSizeOfAllTransferedChunks = 0;
  }

  _transform(chunk, encoding, callback) {
    this.totalSizeOfAllTransferedChunks += chunk.byteLength;
    if (this.totalSizeOfAllTransferedChunks > this.limit) {
      console.log("throw new LimitExceededError() CALLED");
      callback(new LimitExceededError, null);
    } else {
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
