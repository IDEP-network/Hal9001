import {INodePayload} from './INodePayload';
import {TNodeException} from '../types/TNodeException';
import {ColorResolvable} from 'discord.js';

export interface IEmbed {
    color?: ColorResolvable,
    description?: string,
    nodeName?: string,
    payload?: INodePayload,
    type: TNodeException,
}