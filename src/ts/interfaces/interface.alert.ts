import {InterfaceNodePayload} from './interface.nodePayload';
import {TypeNodeException} from '../types/type.nodeException';
import {ColorResolvable} from 'discord.js';

export interface InterfaceAlert {
    color?: ColorResolvable,
    description?: string,
    nodeName?: string,
    payload?: InterfaceNodePayload,
    type?: TypeNodeException,
    title?: string
}