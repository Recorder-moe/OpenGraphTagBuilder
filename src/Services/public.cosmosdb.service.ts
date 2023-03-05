declare const process: any;
const COSMOS_KEY: string = process.env.COSMOS_KEY;
const COSMOS_ENDPOINT: string = process.env.COSMOS_ENDPOINT;

import {
  Container,
  QueryIterator,
  FeedOptions,
  CosmosClientOptions,
  CosmosClient,
} from '@azure/cosmos';
import { IChannel } from '../Models/Channel';
import { IVideo, IVideoInfo } from '../Models/Video';

export class PublicCosmosdbService {
  videosContainer: Container;
  channelContainer: Container;
  constructor() {
    const cosmosClientOption: CosmosClientOptions = {
      endpoint: COSMOS_ENDPOINT,
      key: COSMOS_KEY,
    };
    const cosmosClient = new CosmosClient(cosmosClientOption);
    const database = cosmosClient.database('Public');

    this.videosContainer = database.container('Videos');
    this.channelContainer = database.container('Channels');
  }
  async getVideos(options?: FeedOptions): Promise<QueryIterator<IVideo>> {
    return this.videosContainer.items.query<IVideo>(
      {
        query: 'SELECT * FROM Videos ORDER BY Videos.Timestamps.PublishedAt DESC',
        parameters: [],
      },
      options
    );
  }
  async getVideoById(id: string, partitionKey: string): Promise<IVideo | undefined> {
    const { resource } = await this.videosContainer.item(id, partitionKey).read<IVideo>();
    return resource;
  }
  async getAllChannels(): Promise<IChannel[]> {
    const { resources } = await this.channelContainer.items.readAll<IChannel>().fetchAll();
    return resources;
  }
  async getChannelById(id: string, partitionKey?: string): Promise<IChannel | undefined> {
    if (!partitionKey) {
      const result = await this.channelContainer.items
        .query<IChannel>({
          query: 'SELECT * FROM Channels WHERE Channels.id = @id',
          parameters: [{ name: '@id', value: id }],
        })
        .fetchNext();
      return result.resources[0];
    }

    const { resource } = await this.channelContainer.item(id, partitionKey).read<IChannel>();
    return resource;
  }
  async getVideosByChannelId(
    channelId: string,
    options?: FeedOptions
  ): Promise<QueryIterator<IVideo>> {
    return this.videosContainer.items.query<IVideo>(
      {
        query:
          'SELECT * FROM Videos WHERE Videos.ChannelId = @channelId ORDER BY Videos.Timestamps.PublishedAt DESC',
        parameters: [{ name: '@channelId', value: channelId }],
      },
      options
    );
  }
  async getArchivedVideos(limit: number, options?: FeedOptions): Promise<QueryIterator<IVideo>> {
    return this.videosContainer.items.query<IVideo>(
      {
        query:
          'SELECT * FROM Videos WHERE Videos.Status = 40 ORDER BY Videos.ArchivedTime DESC OFFSET 0 LIMIT @limit',
        parameters: [{ name: '@limit', value: limit }],
      },
      options
    );
  }
  async getSourceDeletedOrEditedVideos(
    limit: number,
    options?: FeedOptions
  ): Promise<QueryIterator<IVideo>> {
    return this.videosContainer.items.query<IVideo>(
      {
        query:
          'SELECT * FROM Videos WHERE Videos.Status = 40 AND (Videos.SourceStatus = 61 OR Videos.SourceStatus = 62 OR Videos.SourceStatus = 54) ORDER BY Videos.ArchivedTime DESC OFFSET 0 LIMIT @limit',
        parameters: [{ name: '@limit', value: limit }],
      },
      options
    );
  }
  async getAllVideoInfos(options?: FeedOptions): Promise<QueryIterator<IVideoInfo>> {
    return this.videosContainer.items.query<IVideoInfo>(
      {
        query: 'SELECT Videos.id, Videos.ChannelId, Videos.Title FROM Videos',
        parameters: [],
      },
      options
    );
  }
}
