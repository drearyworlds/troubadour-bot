import fs from "fs";
import LogService from '../logging/log-service'

class ConfigurationService {
    private static instance: ConfigurationService;
    private static configFileName = 'config.json'
    private twitchBotUsername?: string;
    private twitchBotToken?: string;
    private twitchChannelName?: string;

    constructor() {
        LogService.log('Created new instance of ConfigurationService');
    }

    public initialize(userDataPath: string) {
        LogService.log('Initializing ConfigurationService');

        try {
            const configFileFullPath = `${userDataPath}\\${ConfigurationService.configFileName}`
            const configFileCurrentDirectory = `${ConfigurationService.configFileName}`

            // Load config file only if it exists
            if (fs.existsSync(configFileFullPath)) {
                LogService.log(`Found config.json at: ${configFileFullPath}`)
                let config = JSON.parse(fs.readFileSync(configFileFullPath).toString());
                this.twitchBotUsername = config.twitchBotUsername;
                this.twitchBotToken = config.twitchBotToken;
                this.twitchChannelName = config.twitchChannelName;
            } else if (fs.existsSync(configFileCurrentDirectory)) {
                LogService.log(`Found config.json at: ${configFileCurrentDirectory}`)
                let config = JSON.parse(fs.readFileSync(configFileCurrentDirectory).toString());
                this.twitchBotUsername = config.twitchBotUsername;
                this.twitchBotToken = config.twitchBotToken;
                this.twitchChannelName = config.twitchChannelName;
            } else {
                LogService.log(`configFileFullPath: ${configFileFullPath}`)
                LogService.log(`configFileCurrentDirectory: ${configFileCurrentDirectory}`)
                LogService.log("Cannot find config.json!")
            }

            LogService.log(`twitchBotUsername: ${this.twitchBotUsername}`)
            LogService.log(`twitchBotToken: ${this.twitchBotToken}`)
            LogService.log(`twitchChannelName: ${this.twitchChannelName}`)
        } catch {
            console.error("Exception initalizing configuration!")
        }
    }

    public static getInstance(): ConfigurationService {
        if (!ConfigurationService.instance) {
            ConfigurationService.instance = new ConfigurationService();
        }
        return ConfigurationService.instance;
    }

    public getTwitchBotUsername() {
        return this.twitchBotUsername;
    }

    public getTwitchBotToken() {
        return this.twitchBotToken;
    }

    public getTwitchChannelName() {
        return this.twitchChannelName;
    }
}

export default ConfigurationService.getInstance();