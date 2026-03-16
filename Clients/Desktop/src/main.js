const {
  app,
  BrowserWindow,
  Tray
} = require('electron');
const path = require('path');

const iconPath = path.join(__dirname, './favicon.ico');

if (require('electron-squirrel-startup')) return app.quit();

function createWindow() {
  const win = new BrowserWindow({
    icon: iconPath,
    width: 450,
    height: 640,
    roundedCorners: true,
    useContentSize: true,
    autoHideMenuBar: true,
    alwaysOnTop: true,
    fullscreenable: false,
    resizable: false,
    maximizable: false
  })

  win.loadFile('./src/index.html');
}
app.whenReady().then(() => {
  createWindow();
})
app.on('activate', function() {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit()
})