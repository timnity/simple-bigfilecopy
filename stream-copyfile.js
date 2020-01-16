const stream = require('stream');
const fs = require('fs');

let fileName = process.argv[2];
let destPath = process.argv[3];

const readable = fs.createReadStream(fileName);
const writeable = fs.createWriteStream(destPath || 'output');

fs.stat(fileName, (err, stats) => {
  this.fileSize = stats.size;
  this.counter = 1;
  this.fileArray = fileName.split('.');

  try {
    this.duplicate = destPath + '/' + this.fileArray[0] + '_Copy.' + this.fileArray[1];
  } catch (error) {
    console.exception('File name is invalid! please pass the proper one');
  }

  process.stdout.write(`File: ${this.duplicate} is being created:`);

  readable.on('data', (chunk) => {
    let percentageCopied = ((chunk.length * this.counter) / this.fileSize) * 100;
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`${Math.round(percentageCopied)}%`);
    writeable.write(chunk);
    this.counter += 1;
  });

  readable.on('end', (e) => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    writeable.write('Successfully finished the operation!');
    return;
  });

  readable.on('error', (e) => {
    console.log('Some error occured: ', e);
  });

  writeable.on('finish', () => {
    console.log('Successfully created the file copy!');
  });

});