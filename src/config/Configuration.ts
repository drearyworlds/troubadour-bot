import fs from "fs";

class Configuration {
    private static instance: Configuration;
    private static configFileName = 'config.json'
    private twitchBotUsername?: string;
    private twitchBotToken?: string;
    private twitchChannelName?: string;

    constructor() {
        console.log('Created new instance of Configuration');
    }

    public initialize(userDataPath: string) {
        console.log('Initializing Configuration');

        try {
            const configFileFullPath = `${userDataPath}\\${Configuration.configFileName}`
            const configFileCurrentDirectory = `${Configuration.configFileName}`

            // Load config file only if it exists
            if (fs.existsSync(configFileFullPath)) {
                console.log(`Found config.json at: ${configFileFullPath}`)
                let config = JSON.parse(fs.readFileSync(configFileFullPath).toString());
                this.twitchBotUsername = config.twitchBotUsername;
                this.twitchBotToken = config.twitchBotToken;
                this.twitchChannelName = config.twitchChannelName;
            } else if (fs.existsSync(configFileCurrentDirectory)) {
                console.log(`Found config.json at: ${configFileCurrentDirectory}`)
                let config = JSON.parse(fs.readFileSync(configFileCurrentDirectory).toString());
                this.twitchBotUsername = config.twitchBotUsername;
                this.twitchBotToken = config.twitchBotToken;
                this.twitchChannelName = config.twitchChannelName;
            } else {
                console.log(`configFileFullPath: ${configFileFullPath}`)
                console.log(`configFileCurrentDirectory: ${configFileCurrentDirectory}`)
                console.log("Cannot find config.json!")
            }

            console.log(`twitchBotUsername: ${this.twitchBotUsername}`)
            console.log(`twitchBotToken: ${this.twitchBotToken}`)
            console.log(`twitchChannelName: ${this.twitchChannelName}`)
        } catch {
            console.error("Exception initalizing configuration!")
        }
    }

    public static getInstance(): Configuration {
        if (!Configuration.instance) {
            Configuration.instance = new Configuration();
        }
        return Configuration.instance;
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

export default Configuration.getInstance();