const fs = require('fs');
const path = require('path');

const sourceFolder = path.join(__dirname, 'src');
const js = path.join(sourceFolder, 'index.js')
const dTs = path.join(sourceFolder, 'index.d.ts')

fs.copyFileSync(js, './index.js');
fs.copyFileSync(dTs, './index.d.ts');

fs.unlinkSync(js)
fs.unlinkSync(dTs)
