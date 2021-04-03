import { TroubadourBot } from './troubadour-bot'
import Configuration from './config/Configuration'

Configuration.initialize(`.`)

// Start the Troubadour server
let server : TroubadourBot = new TroubadourBot()
server.Run()