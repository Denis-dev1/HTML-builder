const fs = require('fs');

const textFromFile = fs.createReadStream(__dirname + '/text.txt');

textFromFile.on('data', function (chunk) {
  console.log('\n' + chunk);
});
