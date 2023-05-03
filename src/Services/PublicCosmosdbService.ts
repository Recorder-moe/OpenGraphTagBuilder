declare const process: any;
const COSMOS_KEY: string = process.env.COSMOS_KEY;
const COSMOS_ENDPOINT: string = process.env.COSMOS_ENDPOINT;

import { CosmosClient } from '@cfworker/cosmos';
import { QueryParameter } from '@cfworker/cosmos/dist/client';
import { IChannel } from '../Models/Channel';
import { IVideo } from '../Models/Video';

export class PublicCosmosdbService {
  cosmosClient: CosmosClient;

  constructor() {
    this.cosmosClient = new CosmosClient({
      endpoint: COSMOS_ENDPOINT,
      masterKey: COSMOS_KEY,
    });
  }

  async getVideoById(docId: string, partitionKey: string): Promise<IVideo> {
    console.log(`getVideoById: ${docId}, ${partitionKey}`);
    const res = await this.cosmosClient.getDocument<IVideo>({
      docId,
      partitionKey,
      collId: 'Videos',
      dbId: 'Public',
    });
    return res.json();
  }

  async getChannelById(id: string): Promise<IChannel> {
    const query = `SELECT * FROM Channels WHERE Channels.id = @id`;
    const parameters: QueryParameter[] = [{ name: '@id', value: id }];
    const res = await this.cosmosClient.queryDocuments<IChannel>({
      query,
      parameters,
      collId: 'Channels',
      dbId: 'Public',
    });
    const results = await res.json();
    return results[0];
  }

  async getVideoLists(): Promise<IVideo[]> {
    const query = `SELECT v.id, v.ChannelId FROM Videos AS v WHERE v.Status >= 40 and v.Status < 50`;
    const res = await this.cosmosClient.queryDocuments<IVideo>({
      query,
      collId: 'Videos',
      dbId: 'Public',
    });
    const results = await res.json();
    return results;
  }

  async getChannelLists(): Promise<IChannel[]> {
    const query = `SELECT c.id FROM Channels AS c WHERE c.CanActive != false`;
    const res = await this.cosmosClient.queryDocuments<IChannel>({
      query,
      collId: 'Channels',
      dbId: 'Public',
    });
    const results = await res.json();
    return results;
  }
}
