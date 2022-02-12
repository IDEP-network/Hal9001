import {INodePayload} from "./INodePayload";
import {NodeException} from "../types/NodeException";
import {ColorResolvable} from "discord.js";

export interface IEmbed {
    color: ColorResolvable,
    description?: string,
    nodeName?: string,
    payload?: INodePayload,
    type: NodeException,
}