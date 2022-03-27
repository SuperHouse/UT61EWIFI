const fs = require("fs");
const path = require("path");
const cwd = process.cwd();
const htmlKey = "1fda56b.0057529";
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
  process.exit(1);
}
if (process.argv.length < 3 || typeof process.argv[2] !== 'string') {
  console.error('UNABLE TO FIND VERSION FROM ARGS')
  process.exit(1);
}

nodeRedCode[keyIndex].meta.version = process.argv[2];

fs.writeFileSync(nodeRedJsonFile, JSON.stringify(nodeRedCode));
console.log(nodeRedCode[keyIndex].meta.version);