const fs = require('fs');
const path = require('path');

const secretFolderPath = path.join(__dirname, 'secret-folder');

// Reading folder directory
fs.readdir(secretFolderPath, { withFileTypes: true }, (err, files) => {
  files.forEach((file) => {
    if (file.isFile()) {
      // Check if this is a file and not directory
      const filePath = path.join(secretFolderPath, file.name);

      // get data about the file
      fs.stat(filePath, (err, stats) => {
        if (err) {
          return console.error('Cannot get the file data:', err.message);
        }

        const fileName = path.parse(file.name).name; // File name
        const fileExt = path.extname(file.name).slice(1); // File extension excluding dot
        const fileSizeKb = (stats.size / 1024).toFixed(3); // File size

        console.log(`${fileName} - ${fileExt} - ${fileSizeKb}kb`);
      });
    }
  });
});
