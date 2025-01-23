const fs = require('fs/promises');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const distAssetsPath = path.join(projectDist, 'assets');

async function copyAssets(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true });

    const items = await fs.readdir(src, { withFileTypes: true });
    for (const item of items) {
      const srcPath = path.join(src, item.name);
      const destPath = path.join(dest, item.name);

      if (item.isDirectory()) {
        await copyAssets(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (err) {
    console.error('Error when copying assets:', err);
  }
}

copyAssets(assetsPath, distAssetsPath);

// adding styles in styles.css
async function bundleStyles() {
  try {
    const files = await fs.readdir(stylesPath);
    const styleOutputPath = path.join(projectDist, 'style.css');
    const writeStream = await fs.open(styleOutputPath, 'w');

    for (const file of files) {
      const filePath = path.join(stylesPath, file);
      const fileExt = path.extname(file);

      if (fileExt === '.css') {
        const content = await fs.readFile(filePath, 'utf-8');
        await writeStream.write(content + '\n');
      }
    }

    await writeStream.close();
  } catch (err) {
    console.error('Error when creating style.css:', err);
  }
}

bundleStyles();
