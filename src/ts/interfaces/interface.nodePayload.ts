import {TypeNodeException} from '../types/type.nodeException';

export type InterfaceNodePayload = {
    voting_power: string,
    catching_up: boolean,
    n_peers: string,
    exception?: TypeNodeException,
    name?: string,
    address?: string
}