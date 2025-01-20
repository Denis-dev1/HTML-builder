const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

// path to folders and files
const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const bundleFile = path.join(outputDir, 'bundle.css');

async function bundleStyles() {
  try {
    // check if the project-dist folder exist. Create if not
    await fsPromises.mkdir(outputDir, { recursive: true });

    // create a write stream in bundle.css
    const writeStream = fs.createWriteStream(bundleFile);

    // read folder styles files
    const files = await fsPromises.readdir(stylesDir, { withFileTypes: true });

    for (const item of files) {
      const filePath = path.join(stylesDir, item.name);

      //   checking that file has .css extension
      if (item.isFile() && path.extname(item.name) === '.css') {
        const data = await fsPromises.readFile(filePath, 'utf-8');
        writeStream.write(data + '\n');
      }
    }

    writeStream.end();
    console.log(`Styles added successfully into ${bundleFile}`);
  } catch (error) {
    console.error('Error bundling styles:', error);
  }
}

bundleStyles();
