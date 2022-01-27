import { NodeException } from "./NodeException";

export type NodePayload = {
    voting_power: string,
    catching_up: boolean,
    n_peers: string,
    exception?: NodeException,
    name?: string,
    address?:string
}