import {NodeException} from '../types/NodeException';

export type INodePayload = {
    voting_power: string,
    catching_up: boolean,
    n_peers: string,
    exception?: NodeException,
    name?: string,
    address?: string
}