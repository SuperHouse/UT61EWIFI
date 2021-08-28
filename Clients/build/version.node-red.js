const fs = require("fs");
const path = require("path");
const cwd = process.cwd();
const htmlKey = "1fda56b.0057529";
const nodeRedJsonFile = path.join(cwd, "./ut61e.json");
const nVersion = require('./now-version.js');

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

nodeRedCode[keyIndex].meta.version = nVersion(nodeRedCode[keyIndex].meta.version);

fs.writeFileSync(nodeRedJsonFile, JSON.stringify(nodeRedCode));
console.log(nodeRedCode[keyIndex].meta.version);