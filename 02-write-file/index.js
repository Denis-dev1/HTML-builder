const fs = require('fs');
const readline = require('readline');

//Interface for user Input
const userInput = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Write Stream to add to the file
const writeStream = fs.createWriteStream(__dirname + '/newTxt.txt', {
  flags: 'a',
});

// Welcome message
console.log(
  "Hello, enter text to add to file. To EXIT, enter 'exit' or press 'Ctrl+C':",
);

userInput.on('line', (input) => {
  // checking for word 'exit'
  if (input.toLowerCase() === 'exit') {
    console.log("Thanks. Your input saved to 'newTxt.txt'.");
    userInput.close(); // Kill the process
    return;
  }
  // add text to file
  writeStream.write(input + '\n');

  // wwaiting for the further input
  console.log("Enter text to add to the file or enter 'exit' to exit.");
});

// farewell message when the process is stopped
userInput.on('close', () => {
  writeStream.end(); // end writeStream
  console.log('File saved. Thanks.');
});
