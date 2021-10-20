import tmi from "tmi.js"
import { Constants } from "./config/constants"
import Configuration from "./config/configuration-service"
import LogService from "./logging/log-service"

export class SanchezBot {
    // The client that connects to Twitch
    static client: tmi;

    static musicStream: boolean = false
    static predefinedCommands: Map<string, string> = new Map<string, string>();
    static calculatedCommands: Array<string> = new Array<string>();
    static sanchezCommandMessages: Array<string> = new Array<string>();

    constructor() {
        LogService.log("constructor")
    }

    static calculateStreamType() {
        LogService.log("calculateStreamType")

        const dayOfWeek = new Date().getDay();

        if (dayOfWeek == Constants.SATURDAY) {
            SanchezBot.musicStream = true;
        } else if (dayOfWeek == Constants.MONDAY) {
            SanchezBot.musicStream = false;
        } else {
            console.error("WARNING!!! NOT MONDAY OR SATURDAY. ASSUMING GAME STREAM. ENSURE CORRECT STREAM TYPE!")
            SanchezBot.musicStream = false;
        }
    }

    static getCommandList() {
        LogService.log("getCommandList")

        let commandList: string = "";
        let firstCommand: boolean = true;

        SanchezBot.predefinedCommands.forEach((message: string, command: string) => {
            if (firstCommand) {
                firstCommand = false;
            } else {
                commandList += ", ";
            }

            LogService.log(`Adding ${command} to commandList`)
            commandList += command;
        });

        SanchezBot.calculatedCommands.forEach((command: string) => {
            if (firstCommand) {
                firstCommand = false;
            } else {
                commandList += ", ";
            }

            LogService.log(`Adding ${command} to commandList`)
            commandList += command;
        });

        LogService.log(`Returning: ${commandList} `)
        return commandList;
    }

    static initializeMessages() {
        LogService.log("initializeMessages")

        SanchezBot.predefinedCommands.set("!juliette", "Mi hermana. She will sit sometimes. Or sing sometimes. Or pick me up when I am sleeping.");
        SanchezBot.predefinedCommands.set("!megan", "@meganeggncheese is Mami. She is a good mod, like I am a good boy. Gracias for supporting Papi and his stream.");
        SanchezBot.predefinedCommands.set("!discord", "Join the Dreary Worlds Discord to connect outside of stream. You can suggest songs, games, and drinks, view pictures of me and maybe other puppers, too. https://discord.gg/afmvH6W.");
        SanchezBot.predefinedCommands.set("!clap", "👏 *CLAP* 👏 *CLAP* 👏 *CLAP* 👏 *CLAP* 👏 *CLAP* 👏")
        SanchezBot.predefinedCommands.set("!lurk", "You will enjoy your lurk, yes.")
        SanchezBot.predefinedCommands.set("!joke", "I only know one joke: What do you call a big burrito? A burr! Hahaha! This is very funny!")

        if (SanchezBot.musicStream) {
            SanchezBot.predefinedCommands.set("!songrequest", `To request a song, you will type "!sr song title", like "!sr Calle Ocho", or go to this link to browse the list, yes: https://www.streamersonglist.com/t/drearyworlds/songs `);
            SanchezBot.predefinedCommands.set("!togetherwherever", `Saturday, October 30th, Dreary will be playing the Together Wherever Music Fest at 9pm CST! Tune in all day to follow all the streamers. Click here for more info: https://www.instagram.com/togetherwherevermusic/ `);
        } else {
            SanchezBot.predefinedCommands.set("!minecraft", "To play along on Drearyland, join the Other Dreary Worlds Discord bot! https://discord.gg/afmvH6W. Choose the games role in the #get-roles channel, then head to the #how-to-join channel for rules and instructions!");
        }

        SanchezBot.calculatedCommands.push("!dice")
        SanchezBot.calculatedCommands.push("!sanchez")

        let commandList: string = SanchezBot.getCommandList();
        SanchezBot.predefinedCommands.set("!commands", `Here are the commands you will give to me: ${commandList}. `);

        // Random Sanchez thoughts
        SanchezBot.sanchezCommandMessages.push("Zzzzzzzzzzzzzz....  burritos.....zzz.. tacos..... you will do this for me..... zzzz...");
        SanchezBot.sanchezCommandMessages.push("I like tacos and burritos. You will make me some. You will do this for me.");
        SanchezBot.sanchezCommandMessages.push("I am Sanchez.");
        SanchezBot.sanchezCommandMessages.push("I am truly The Chosen Sanchez.");
        SanchezBot.sanchezCommandMessages.push("You will follow my papi, Dreary.. You will press the heart icon to do this, yes.");
        SanchezBot.sanchezCommandMessages.push("I like to play with my squeaky carrot sometimes. I will not play unless I want to.");
        SanchezBot.sanchezCommandMessages.push("Is it 5:30 yet? 5:30 is dinner time.")
        SanchezBot.sanchezCommandMessages.push("Was that the doorbell?! I will protect you! *bark!* *bark!* *bark!*")
        SanchezBot.sanchezCommandMessages.push("Stop waking me up with this music, Papi.. I am taking a siesta.")
        SanchezBot.sanchezCommandMessages.push("You will ask me to tell a joke. You will type !joke to do this.")
        SanchezBot.sanchezCommandMessages.push("I am a buds.");
        SanchezBot.sanchezCommandMessages.push("I am a good boy.");
        SanchezBot.sanchezCommandMessages.push("Chihuahua is home to Las Barrancas del Cobre, a canyon system bigger than the Grand Canyon, yeeess...");
        SanchezBot.sanchezCommandMessages.push("I am glad my hearing is going. I don't have to hear Papi's music so loud anymore...");
        SanchezBot.sanchezCommandMessages.push("Chihuahua City is the capital of Chihuahua, Mexico. This is where I am from, yes?");
        SanchezBot.sanchezCommandMessages.push("Chihuahua has been inhabited since 12,000 BCE, yes. This is very old. I am very old, too.");
        SanchezBot.sanchezCommandMessages.push("I do not like having this cone on. How much longer must I wear it?");
    }

    initialize() {
        LogService.log("initialize")

        SanchezBot.calculateStreamType();
        SanchezBot.initializeMessages();

        // Define configuration options
        const opts = {
            identity: {
                username: Configuration.getTwitchBotUsername(),
                password: Configuration.getTwitchBotToken()
            },
            channels: [
                Configuration.getTwitchChannelName()
            ]
        };

        LogService.log("****************************************")
        LogService.log(Configuration.getTwitchBotUsername())
        LogService.log(Configuration.getTwitchBotToken())
        LogService.log(Configuration.getTwitchChannelName())
        LogService.log("****************************************")

        // Create a client with our options
        SanchezBot.client = new tmi.client(opts);
        SanchezBot.client.on('connected', SanchezBot.onConnectedHandler);
        SanchezBot.client.connect();
        SanchezBot.client.on('message', SanchezBot.onMessageHandler);

        SanchezBot.setUpCommonIntervalCommands();

        if (SanchezBot.musicStream) {
            SanchezBot.setUpMusicStreamIntervalCommands();
        } else {
            SanchezBot.setUpGameStreamIntervalCommands();
        }
    }

    // Called every time the bot connects to Twitch chat
    static onConnectedHandler(addr, port) {
        LogService.log(`Connected to ${addr}: ${port} `);
    }

    static executePredefinedCommand(commandName: string) {
        LogService.log(`executePredefinedCommand ${commandName}`)

        try {
            let commandText: string = `${SanchezBot.predefinedCommands.get(commandName)} I am Sanchez.`
            SanchezBot.client.say(Configuration.getTwitchChannelName(), commandText)
            return true;
        } catch (e) {
            console.error(`Caught an exception running predefined command ${commandName}: ${e} `)
        }

        return false;
    }

    static executeCalculatedCommand(commandName: string) {
        LogService.log("executeCalculatedCommand")

        try {
            if (commandName == "!dice") {
                SanchezBot.client.say(Configuration.getTwitchChannelName(), `${SanchezBot.getDiceCommand()} I am Sanchez.`);
                return true;
            } else if (commandName == "!sanchez") {
                SanchezBot.client.say(Configuration.getTwitchChannelName(), `${SanchezBot.getSanchezCommand()}`);
            }
        } catch (e) {
            console.error(`Caught an exeption running calculated command ${commandName} : ${e} `)
        }

        return false;
    }

    static handleCommand(target: string, commandName: string) {
        LogService.log(`handleCommand: ${commandName} `)

        let executed: boolean = false;

        if (SanchezBot.predefinedCommands.has(commandName)) {
            executed = SanchezBot.executePredefinedCommand(commandName)
        } else {
            executed = SanchezBot.executeCalculatedCommand(commandName)
        }

        return executed;
    }

    // Called every time a message comes in
    static onMessageHandler(target, context, message, self) {
        try {
            if (self) { return; } // Ignore messages from the bot

            // Remove whitespace from chat message
            const commandName = message.trim();
            let executed = false;

            if (commandName.startsWith("!")) {
                LogService.log("commandName startsWith !");
                executed = SanchezBot.handleCommand(target, commandName);

                if (executed) {
                    LogService.log(`Executed ${commandName} command`);
                } else {
                    console.error(`Failed to execute ${commandName} command`)
                }
            }
        } catch (e) {
            console.error(`Caught an exception processing a message: ${message}: ${e} `)
        }
    }

    // Function called when the "dice" command is issued
    static rollDie(sides) {
        LogService.log("rollDie");

        return Math.floor(Math.random() * sides) + 1;
    }

    static getDiceCommand() {
        LogService.log("getDiceCommand");

        const die1 = SanchezBot.rollDie(6);
        const die2 = SanchezBot.rollDie(6);
        return `You rolled a ${die1} and a ${die2}. That is ${die1 + die2}.`;
    }

    static getSanchezCommand() {
        let randomIndex = Math.floor((Math.random() * SanchezBot.sanchezCommandMessages.length));
        LogService.log(`Random index: ${randomIndex}`)
        return SanchezBot.sanchezCommandMessages[randomIndex];
    }

    static setUpCommonIntervalCommands() {
        LogService.log("setUpCommonIntervalCommands")

        setInterval(() => {
            SanchezBot.executeCalculatedCommand("!sanchez")
        }, Constants.ONE_HOUR_IN_MS)

        setInterval(() => {
            SanchezBot.executePredefinedCommand("!discord")
        }, Constants.FORTY_FIVE_MINUTES_IN_MS)

        setInterval(() => {
            SanchezBot.executePredefinedCommand("!togetherwherever")
        }, Constants.THIRTY_ONE_MINUTES_IN_MS)        
    }

    static setUpGameStreamIntervalCommands() {
        LogService.log("setUpGameStreamIntervalCommands")

        setInterval(() => {
            SanchezBot.executePredefinedCommand("!minecraft")
        }, Constants.TWENTY_NINE_MINUTES_IN_MS)
    }

    static setUpMusicStreamIntervalCommands() {
        
        LogService.log("setUpMusicStreamIntervalCommands")

        setInterval(() => {
            SanchezBot.executePredefinedCommand("!songrequest")
        }, Constants.TWENTY_NINE_MINUTES_IN_MS)
    }
}