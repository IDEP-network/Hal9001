export interface InterfaceConfig {
    cycleTime?: number,
    notifyCycleTime?: number,
    nodes?: {
        [key in string]: string
    },
    discordOperators?: string[],
    telegramOperators?: string[],
    nodesBoundaryNumber?: number
}