const fs = require("fs");
const path = require("path");
const cwd = process.cwd();
const webDistDir = path.join(cwd, '../SimpleWeb/web/dist');
console.log('Found template file... building');
const cssDir = path.join(webDistDir, './css');
const jsDir = path.join(webDistDir, './js');

let cssFiles = fs.readdirSync(cssDir);
let jsFiles = fs.readdirSync(jsDir);

let cssFileContents = [];
for (let file of cssFiles) {
  cssFileContents.push('<style>' + fs.readFileSync(path.join(cssDir, file), "utf8") + '</style>');
  console.log(`Found CSS: ${file}`);
}
let jsFileContents = [];
for (let file of jsFiles) {
  if (!file.endsWith('.js')) continue;
  jsFileContents.push('<script>' + fs.readFileSync(path.join(jsDir, file), "utf8") + '</script>');
  console.log(`Found JS: ${file}`);
}

let htmlTemplate = fs.readFileSync(path.join(cwd, './build.template.html'), 'utf8');

const cssKey = '--CSS--';
const cssIndex = htmlTemplate.indexOf(cssKey);
htmlTemplate = htmlTemplate.substring(0, cssIndex) + cssFileContents.join('\n') + htmlTemplate.substring(cssIndex + cssKey.length);

const jsKey = '--JAVASCRIPT--';
const jsIndex = htmlTemplate.indexOf(jsKey);
htmlTemplate = htmlTemplate.substring(0, jsIndex) + jsFileContents.join('\n') + htmlTemplate.substring(jsIndex + jsKey.length);

console.log('Found template file... deploying');

fs.writeFileSync(path.join(cwd, './src/index.html'), htmlTemplate);

console.log('Found template file... complete');