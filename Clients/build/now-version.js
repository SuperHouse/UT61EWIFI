module.exports = function(version) {
  let versionSplit = version.split('-');
  let versionKeys = versionSplit[0].split('.');
  let major = versionKeys[0];
  let minor = versionKeys[1];
  let now = new Date();
  let month = `${now.getMonth()+1}`;
  if (month.length == 1)
    month = `0${month}`
  let day = `${now.getDate()}`;
  if (day.length == 1)
    day = `0${day}`
  /*let hour = `${now.getHours()}`;
  if (hour.length == 1)
    hour = `0${hour}`
  let minutes = `${now.getMinutes()}`;
  if (minutes.length == 1)
    minutes = `0${minutes}`
  let seconds = `${now.getSeconds()}`;
  if (seconds.length == 1)
    seconds = `0${seconds}`*/
  let micro = `${now.getFullYear().toString().substring(2)}${month}${day}`;//${hour}${minutes}${seconds}`;
  return `${major}.${minor}.${micro}`;
}