export interface IConfig {
    cycleTime: number,
    notifyCycleTime: number,
    nodes: {
        [key in string]: string
    },
    operators: string[]
}