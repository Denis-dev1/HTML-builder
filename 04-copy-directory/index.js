const fs = require('fs/promises');
const path = require('path');
const pathToFiles = path.join(__dirname, 'files');
const pathToCopierdFiles = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    // clear the folder or delete if it's exist
    await fs.rm(pathToCopierdFiles, { force: true, recursive: true });
    // create the folder
    await fs.mkdir(pathToCopierdFiles, { recursive: true });

    // original folder
    const files = await fs.readdir(pathToFiles);

    // copy files
    for (const item of files) {
      const pathToFile = path.join(pathToFiles, item);
      const pathToCopiedFile = path.join(pathToCopierdFiles, item);
      await fs.copyFile(pathToFile, pathToCopiedFile);
    }

    console.log('Folder copied!');
  } catch (err) {
    console.error('Oops. Error:', err.name);
    console.error('Error message:', err.message);
  }
}

copyDir();
