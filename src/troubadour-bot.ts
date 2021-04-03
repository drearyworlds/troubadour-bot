import express from "express";
import bodyParser from "body-parser";
import { Constants } from "./config/constants";
import { SanchezBot } from "./sanchezbot";

export class TroubadourBot {
    expressApp = express();
    port: number = 3000;

    Run() {
        // Initialize bot
        let sanchezBot: SanchezBot = new SanchezBot()
        sanchezBot.initialize()
    }
}