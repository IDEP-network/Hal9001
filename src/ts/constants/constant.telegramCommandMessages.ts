export const ConstantTelegramCommandMessages = {
    CONFIGS: `
                **Usage** - t_operators
                config t_operators add [mention]
                config t_operators remove [mention]
                config t_operators view
                
                **Usage** - nodes 
                config nodes add [node_address] [?name]
                config nodes remove [name]
                config nodes view
                
                **Usage** - cycleTime 
                config cycleTime set [time in seconds]
                config cycleTime view
                
                **Usage** -  notifyCycleTime 
                config notifyCycleTime set [time in seconds]
                config notifyCycleTime view
            `,
    HELP: `
                **CONFIGS COMMANDS**
                
                **Usage** - \` operators \`
                config operators add [mention]
                config operators remove [mention]
                config operators view
                
                **Usage** - \` nodes \`
                config nodes add [node_address] [?name]
                config nodes remove [name]
                config nodes view
                
                **Usage** - \` cycleTime \`
                config cycleTime set [time in seconds]
                config cycleTime view
                
                **Usage** - \` notifyCycleTime \`
                config notifyCycleTime set [time in seconds]
                config notifyCycleTime view
                
                **NODE_INFO COMMANDS**
                node_info
                node_info [node name]
        `
}