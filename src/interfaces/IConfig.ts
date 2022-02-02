export interface IConfig {
    cycleTime: number,
    notifyCycleTime: number,
    nodes: {
        [key in string]: string
    },
    operators: string[],
    D2?: number //full_node_peer_danger_boundary
}