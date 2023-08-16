declare const process: any;
const COUCH_ENDPOINT: string = process.env.COUCH_ENDPOINT;

import PouchDB from 'pouchdb-browser';
import PouchDBFind from 'pouchdb-find';
import { IVideo } from '../../Models/Video';
import { IChannel } from '../../Models/Channel';
import { IDBService } from '../../interface/IDBService';

export class CouchDBService implements IDBService {
  // !IMPORTANT!
  // Remember to create indexes in the CouchDB at the C# backend if you change the selector in the find function

  private videosDatabase: PouchDB.Database<IVideo> = new PouchDB<IVideo>(
    `${COUCH_ENDPOINT}videos`,
    {
      skip_setup: true,
      fetch: function (url, opts) {
        opts!.credentials = undefined;
        return PouchDB.fetch(url, opts);
      },
    }
  );
  private channelDatabase: PouchDB.Database<IChannel> = new PouchDB<IChannel>(
    `${COUCH_ENDPOINT}channels`,
    {
      skip_setup: true,
      fetch: function (url, opts) {
        opts!.credentials = undefined;
        return PouchDB.fetch(url, opts);
      },
    }
  );

  constructor() {
    // https://pouchdb.com/guides/databases.html
    PouchDB.plugin(PouchDBFind);
    this.fetchDatabaseInfo();
  }

  async fetchDatabaseInfo() {
    console.log(
      'CouchDB videos database info',
      await this.videosDatabase.info(),
      await this.videosDatabase.getIndexes()
    );
    console.log(
      'CouchDB channels database info',
      await this.channelDatabase.info(),
      await this.channelDatabase.getIndexes()
    );
  }

  async getVideoById(id: string, partitionKey: string): Promise<IVideo | undefined> {
    const video = await this.videosDatabase.get<IVideo>(`${partitionKey}:${id}`, {
      latest: true,
    });
    if (video) video.id = video._id.split(':').pop()!;
    return video as IVideo | undefined;
  }

  async getChannelById(id: string): Promise<IChannel | undefined> {
    // Find a channel which '_id' ends with the given id
    const response = (await this.channelDatabase.find({
      selector: {
        _id: { $regex: `:${id}$` },
      },
      limit: 1,
    })) as PouchDB.Find.FindResponse<IChannel>;
    const channel = response.docs.shift();

    if (channel) channel.id = channel._id.split(':').pop()!;
    return channel as IChannel | undefined;
  }

  async getVideoLists(): Promise<IVideo[]> {
    const response = (await this.videosDatabase.find({
      selector: {
        _id: { $regex: '^(?!_design)' },
      },
      fields: ['_id', 'ChannelId'],
      limit: 100000,
    })) as PouchDB.Find.FindResponse<IVideo>;
    return response.docs.map((video) => {
      video.id = video._id.split(':').pop()!;
      return video as IVideo;
    });
  }

  async getChannelLists(): Promise<IChannel[]> {
    const response = (await this.channelDatabase.find({
      selector: {
        _id: { $regex: '^(?!_design)' },
      },
      fields: ['_id', 'Hide'],
      limit: 100000,
    })) as PouchDB.Find.FindResponse<IChannel>;
    return response.docs.map((channel) => {
      channel.id = channel._id.split(':').pop()!;
      return channel as IChannel;
    });
  }
}
