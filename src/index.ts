require('fix-esm').register()
import { DiscordClient } from "./bin/Discord";
import { connectionsConfig } from "./Config";
import { Monitoring } from "./services/Monitoring";
import Redis from "./services/Redis"


process.on('uncaughtException', (e) => {
    console.error(e);
});

process.on('unhandledRejection', (e) => {
    console.error(e);
});

(async () => {
    await Redis.connect();
    await Redis.loadConfig()
    const client = new DiscordClient();
    client.login(connectionsConfig.discordToken);
    client.on('ready', () => {
        new Monitoring()
    })
})()


/*

// this is what i meant
// OK I THINKITS OK
tHANKS , BUT CAN YOU REVIEW CODE PLEASE?
//  SURE, OK, THAK
//  BUT DON'T YOU PREFER LIVEEE EHARE /
you mean github?
check discord
*/