import { app, BrowserWindow, ipcRenderer, Notification } from 'electron'
import * as path from 'path'
import * as url from 'url'
import Configuration from './config/configuration-service'
import LogService from './logging/log-service'
import { TroubadourBot } from './troubadour-bot'

let win: BrowserWindow

app.on('ready', () => {
  console.log("READY")
  createWindow();

  LogService.win = win
  
  Configuration.initialize(app.getPath(`userData`))
  // Start the Troubadour bot
  let bot: TroubadourBot = new TroubadourBot()
  bot.Run()
});

app.on('activate', () => {
  console.log("ACTIVATE")
  if (win === null) {
    createWindow()
  }
})

function createWindow() {
  win = new BrowserWindow(
    {
      width: 800, height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    })

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, `/../dist/index.html`),
      protocol: 'file:',
      slashes: true
    })
  )

  win.on('closed', () => {
    console.log("CLOSED")
    win = null
  })
}

LogService.log(`Userdata path: ${app.getPath(`userData`)}`)