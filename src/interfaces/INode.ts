import {ISentMessage} from './ISentMessage';

export interface INode {
    id: number;
    host: string;
    port: number;
    chance: number;
}