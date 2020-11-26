import {IMessage} from './IMessage';

export interface ISentMessage extends IMessage{
    destId: number;
}
