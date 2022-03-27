const fs = require('fs');
const path = require('path');
const versionFile = path.join(process.cwd(), './Clients/VERSION.txt');
const nVersion = require('./now-version.js');

let relVersion = nVersion(fs.readFileSync(versionFile).toString());
console.log(`RELVERSION=${relVersion}`)
console.log(`::set-output name=RELVERSION::${relVersion}`);