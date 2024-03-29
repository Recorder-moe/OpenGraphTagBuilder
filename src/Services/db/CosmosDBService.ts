declare const process: any;
const COSMOS_KEY: string = process.env.COSMOS_KEY;
const COSMOS_ENDPOINT: string = process.env.COSMOS_ENDPOINT;

import { CosmosClient } from '@cfworker/cosmos';
import { QueryParameter } from '@cfworker/cosmos/dist/client';
import { IChannel } from '../../Models/Channel';
import { IVideo } from '../../Models/Video';
import { IDBService } from '../../interface/IDBService';

export class CosmosDBService implements IDBService {
  private cosmosClient: CosmosClient;

  constructor() {
    this.cosmosClient = new CosmosClient({
      endpoint: COSMOS_ENDPOINT,
      masterKey: COSMOS_KEY,
    });
  }

  async getVideoById(id: string, partitionKey: string): Promise<IVideo | undefined> {
    console.log(`getVideoById: ${id}, ${partitionKey}`);
    const res = await this.cosmosClient.getDocument<IVideo>({
      docId: id,
      partitionKey,
      collId: 'Videos',
      dbId: 'Public',
    });
    return res.json();
  }

  async getChannelById(id: string): Promise<IChannel | undefined> {
    const query = `SELECT * FROM Channels AS c WHERE c.id = @id`;
    const parameters: QueryParameter[] = [{ name: '@id', value: id }];
    const res = await this.cosmosClient.queryDocuments<IChannel>({
      query,
      parameters,
      collId: 'Channels',
      dbId: 'Public',
    });
    const results = await res.json();
    return results.length > 0 ? results[0] : undefined;
  }

  async getVideoLists(): Promise<IVideo[]> {
    const query = `SELECT v.id, v.ChannelId FROM Videos AS v`;
    const res = await this.cosmosClient.queryDocuments<IVideo>({
      query,
      collId: 'Videos',
      dbId: 'Public',
    });
    const results = await res.json();
    return results;
  }

  async getChannelLists(): Promise<IChannel[]> {
    const query = `SELECT c.id, c.Hide FROM Channels AS c`;
    const res = await this.cosmosClient.queryDocuments<IChannel>({
      query,
      collId: 'Channels',
      dbId: 'Public',
    });
    const results = await res.json();
    return results;
  }
}
