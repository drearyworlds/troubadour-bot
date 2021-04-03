import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import * as url from 'url'
import Configuration from './config/Configuration'
import { TroubadourBot } from './troubadour-bot'

let win: BrowserWindow

app.on('ready', createWindow)

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

function createWindow() {
  win = new BrowserWindow({ width: 800, height: 600 })

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, `/../dist/index.html`),
      protocol: 'file:',
      slashes: true,
    })
  )

  win.on('closed', () => {
    win = null
  })
}

console.log(`Userdata path: ${app.getPath(`userData`)}`)
Configuration.initialize(app.getPath(`userData`))

// Start the Troubadour server
let bot : TroubadourBot = new TroubadourBot()
bot.Run()