const fs = require("fs");
const path = require("path");
const cwd = process.cwd();
const htmlKey = "1fda56b.0057529";
const nodeRedJsonFile = path.join(cwd, "./ut61e.json");

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

let version = nodeRedCode[keyIndex].meta.version;
let versionSplit = version.split('-');
let versionKeys = versionSplit[0].split('.');
let major = versionKeys[0];
let minor = versionKeys[1];
let now = new Date();
let month = `${now.getMonth()}`;
if (month.length == 1)
  month = `0${month}`
let day = `${now.getDate()}`;
if (day.length == 1)
  day = `0${day}`
let hour = `${now.getHours()}`;
if (hour.length == 1)
  hour = `0${hour}`
let minutes = `${now.getMinutes()}`;
if (minutes.length == 1)
  minutes = `0${minutes}`
let seconds = `${now.getSeconds()}`;
if (seconds.length == 1)
  seconds = `0${seconds}`
let micro = `${now.getFullYear()}${month}${day}${hour}${minutes}${seconds}`;
nodeRedCode[keyIndex].meta.version = `${major}.${minor}.${micro}`;

fs.writeFileSync(nodeRedJsonFile, JSON.stringify(nodeRedCode));
console.log(nodeRedCode[keyIndex].meta.version);