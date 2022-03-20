import dotenv from 'dotenv';

dotenv.config({path: __dirname + '/../../.env'});

export const DISCORD_CONFIGS = {
    TOKEN: process.env.DISCORD_TOKEN,
    CHANNEL: process.env.DISCORD_CHANNEL,
    PREFIX: process.env.DISCORD_PREFIX,
    DISCORD_BOT_IS_ACTIVATED: process.env.DISCORD_BOT_ACTIVATE,
};

export const TELEGRAM_CONFIGS = {
    TOKEN: process.env.TELEGRAM_TOKEN,
    CHANNEL: process.env.TELEGRAM_CHANNEL,
    PREFIX: process.env.TELEGRAM_PREFIX,
    TELEGRAM_BOT_IS_ACTIVATED: process.env.TELRGRAM_BOT_ACTIVATE,
};

export const REDIS_CONFIGS = {
    URL: process.env.REDIS_URL
};

export const CONFIGS = {
    cycleTime: 60,
    notifyCycleTime: 20,
    nodesBoundaryNumber: 40,                  // Boundary Number of Nodes
    nodes: {'test': '143.110.246.141:26657'},
    d_operators: ['915532926249222144'],      //Discord operators
    t_operators: ['karen111_bot', 'ArenGr'],  // Telegram Operators
};

