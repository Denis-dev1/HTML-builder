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

// creating index.html
async function buildHTML() {
  try {
    let templateContent = await fs.readFile(templatePath, 'utf-8');

    const componentFiles = await fs.readdir(componentsPath);
    for (const file of componentFiles) {
      const filePath = path.join(componentsPath, file);
      const fileExt = path.extname(file);
      const componentName = path.basename(file, fileExt);

      if (fileExt === '.html') {
        const componentContent = await fs.readFile(filePath, 'utf-8');
        const placeholder = `{{${componentName}}}`;
        templateContent = templateContent.replaceAll(
          placeholder,
          componentContent,
        );
      }
    }

    const outputPath = path.join(projectDist, 'index.html');
    await fs.writeFile(outputPath, templateContent, 'utf-8');
  } catch (err) {
    console.error('Error building index.html:', err);
  }
}

async function createProjectDist() {
  try {
    // 1. creating folder project-dist
    await fs.rm(projectDist, { recursive: true, force: true });
    await fs.mkdir(projectDist, { recursive: true });

    // 2. creating index.html
    await buildHTML();

    // 3. adding styles in styles.css
    await bundleStyles();

    // 4. Copy assets folder
    await copyAssets(assetsPath, distAssetsPath);

    console.log('The project was successfully built!');
  } catch (err) {
    console.error('Project building error:', err);
  }
}

// doing all together
createProjectDist();
