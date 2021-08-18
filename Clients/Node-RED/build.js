const fs = require("fs");
const path = require("path");
const cwd = process.cwd();
const htmlKey = "dd666642.ac1e18";
const webDistDir = path.join(cwd, '../SimpleWeb/web/dist');
const nodeRedJsonFile = path.join(cwd, "./ut61e-nodered-web-ui.json");

let nodeRedCode = JSON.parse(fs.readFileSync(nodeRedJsonFile, "utf8").toString());

let keyIndex = null;
for (let i = 0; i < nodeRedCode.length; i++) {
  if (nodeRedCode[i].id === htmlKey) {
    keyIndex = i;
    break;
  }
}

if (keyIndex === null) {
  console.error('UNABLE TO FIND HTML KEY IN UT61e NODE-RED-UI')
  return process.exit(1);
}

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
htmlTemplate = htmlTemplate.replace('{{CSS}}', cssFileContents.join('\n'));
htmlTemplate = htmlTemplate.replace('{{JAVASCRIPT}}', jsFileContents.join('\n'));

console.log('Found template file... deploying');
nodeRedCode[keyIndex].template = htmlTemplate.replace('"', '\"');

fs.writeFileSync(nodeRedJsonFile, JSON.stringify(nodeRedCode))

console.log('Found template file... complete');