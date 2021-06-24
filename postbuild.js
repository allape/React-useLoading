const fs = require('fs');
const path = require('path');

const sourceFolder = path.join(__dirname, 'src');

fs.copyFileSync(path.join(sourceFolder, 'index.js'), './index.js');
fs.copyFileSync(path.join(sourceFolder, 'index.d.ts'), './index.d.ts');
