import { IChannel } from '../Models/Channel';
import { IVideo } from '../Models/Video';

export interface IDBService {
  getVideoById(id: string, partitionKey: string): Promise<IVideo | undefined>;
  getChannelById(id: string): Promise<IChannel | undefined>;
  getVideoLists(): Promise<IVideo[]>;
  getChannelLists(): Promise<IChannel[]>;
}
