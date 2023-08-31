// Native
const { join } = require('path')
const { format } = require('url')

// Packages
const { BrowserWindow, app, ipcMain, Tray, Menu } = require('electron')
const isDev = require('electron-is-dev')
const actions = require('./actions')
const prepareNext = require('electron-next')
// Prepare the renderer once the app is ready

const iconPath = join(__dirname, '../public/app.png')

Menu.setApplicationMenu(
  Menu.buildFromTemplate([
    {
      label: "操作",
      submenu: [
        {
          label: "退出应用",
          click() {
            app.quit();
          },
        },
      ],
    },
  ])
)

app.whenReady().then(async () => {
  new Tray(iconPath)
  await prepareNext('./renderer')
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: iconPath,
    // frame: false,
    webPreferences: {
      nodeIntegration: false,
      preload: join(__dirname, 'preload.js'),
    },
  })

  const url = isDev
    ? 'http://localhost:8000'
    : format({
        pathname: join(__dirname, '../renderer/out/index.html'),
        protocol: 'file:',
        slashes: true,
      })

  mainWindow.loadURL(url)
})


ipcMain.on('bridge', actions(app))

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit)

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', (event, message) => {
  event.sender.send('message', message)
})

