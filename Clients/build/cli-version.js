const clientsVersion = require('fs').readFileSync('../VERSION.txt').toString();
const nVersion = require('./now-version.js');
console.log(nVersion(clientsVersion.trim()))