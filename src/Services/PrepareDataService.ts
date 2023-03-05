import { PublicCosmosdbService } from './public.cosmosdb.service';
import { IMetaData } from '../Models/MetaData';

export class PrepareDataService {
  publicCosmosdbService: PublicCosmosdbService;

  constructor() {
    this.publicCosmosdbService = new PublicCosmosdbService();
  }

  async PrepareVideoMetadata(videoId: string, channelId: string): Promise<IMetaData> {
    console.log('PrepareVideoMetadata');
    const video = await this.publicCosmosdbService.getVideoById(videoId, channelId);
    return video as IMetaData;
  }

  async PrepareChannelMetadata(channelId: string): Promise<IMetaData> {
    const channel = await this.publicCosmosdbService.getChannelById(channelId);
    return {
      Title: channel?.ChannelName,
      Thumbnail: channel?.Banner,
    };
  }
}
