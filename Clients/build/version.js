const fs = require('fs');
const path = require('path');
const cwdPackJson = path.join(process.cwd(), './package.json');
const nVersion = require('./now-version.js');

let packageJSON = JSON.parse(fs.readFileSync(cwdPackJson).toString());
packageJSON.version = nVersion(packageJSON.version)

fs.writeFileSync(cwdPackJson, JSON.stringify(packageJSON));
console.log(packageJSON.version);