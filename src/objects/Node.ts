
import { INode } from "../interfaces/INode";
import { ISentMessage } from "../interfaces/ISentMessage";

export class Node implements INode{
    id: number;
    host: string;
    port: number;
    chance: number;
}