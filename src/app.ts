import { TroubadourBot } from './troubadour-bot'
import Configuration from './config/Configuration'

Configuration.initialize(`.`)

// Start the Troubadour bot
let bot : TroubadourBot = new TroubadourBot()
bot.Run()