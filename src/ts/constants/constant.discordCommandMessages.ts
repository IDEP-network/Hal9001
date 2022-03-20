export const CONSTANT_DISCORD_COMMAND_MESSAGES = {
    CONFIGS: `
                **Usage** - \` d_operators \`
                config d_operators add <@mention>
                config d_operators remove <@mention>
                config d_operators view
                
                **Usage** - \` nodes \`
                config nodes add <node_address> <?name>
                config nodes remove <name>
                config nodes view
                **Usage** - \` cycleTime \`
                config cycleTime set <time in seconds>
                config cycleTime view
                **Usage** - \` notifyCycleTime \`
                config notifyCycleTime set <time in seconds>
                config notifyCycleTime view
            `,
    HELP: `
            **CONFIGS COMMANDS**
            
            **Usage** - \` operators \`
            config operators add <@mention>
            config operators remove <@mention>
            config operators view
            
            **Usage** - \` nodes \`
            config nodes add <node_address> <?name>
            config nodes remove <name>
            config nodes view
            
            **Usage** - \` cycleTime \`
            config cycleTime set <time in seconds>
            config cycleTime view
            
            **Usage** - \` notifyCycleTime \`
            config notifyCycleTime set <time in seconds>
            config notifyCycleTime view
            
            **NODE_INFO COMMANDS**
            node_info
            node_info <node_name>
        `,
}
