const { BrowserWindow } = require('electron')

const actions = Object.create({})

actions.setTitle = (event, title) => {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win?.setTitle(title)
}

actions.openDebugger = (event) => {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win?.webContents.openDevTools()
}


module.exports = (app) => {
  return (event, eventName, ...rest) => {
    if (actions[eventName]) {
      actions[eventName](event, ...rest)
    }
  }
}
