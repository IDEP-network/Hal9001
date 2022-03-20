export interface InterfaceConfig {
    cycleTime?: number,
    notifyCycleTime?: number,
    nodes?: {
        [key in string]: string
    },
    d_operators?: string[],
    t_operators?: string[],
    nodesBoundaryNumber?: number
}