import { VideoStatus } from './../enum/VideoStatus';
declare const process: any;
const BLOB_ENDPOINT_PUBLIC: string = process.env.BLOB_ENDPOINT_PUBLIC;

import { PublicCosmosdbService } from './PublicCosmosdbService';
import { IMetaData } from '../Models/MetaData';

export class PrepareDataService {
  publicCosmosdbService: PublicCosmosdbService;

  constructor() {
    this.publicCosmosdbService = new PublicCosmosdbService();
  }

  async PrepareVideoMetadata(videoId: string, channelId: string): Promise<IMetaData> {
    const video = await this.publicCosmosdbService.getVideoById(videoId, channelId);
    const channel = await this.publicCosmosdbService.getChannelById(channelId);
    let Description = `Hey, take a look at this awesome video archive on Recorder.moe!`;
    if (
      (video.SourceStatus ?? 0) >= VideoStatus.Expired &&
      video.SourceStatus !== VideoStatus.Exist &&
      video.Status === VideoStatus.Archived
    ) {
      Description = "We've got your back! The video may be gone, but we've archived it for you.";
    }
    if (video.Status === VideoStatus.Expired) {
      Description =
        'Oops, this video is no longer available as it was archived on Recorder.moe more than 30 days ago.';
    }
    if (video.Status >= VideoStatus.Expired && video.SourceStatus !== VideoStatus.Exist) {
      Description = "Sorry, this video can't be found on Recorder.moe.";
    }

    return {
      Title: `Recorder.moe | ${video.Title} | ${channel.ChannelName}`,
      Description,
      Thumbnail: `${BLOB_ENDPOINT_PUBLIC}thumbnails/${video.Thumbnail}`,
    };
  }

  async PrepareChannelMetadata(channelId: string): Promise<IMetaData> {
    const channel = await this.publicCosmosdbService.getChannelById(channelId);
    let Description = `Recorder.moe is keeping an eye on ${channel.ChannelName}'s livestream! We're all about helping you capture those important moments in real time.`;
    if (!channel.Monitoring) {
      Description = `Hey there! Recorder.moe is not monitoring ${channel.ChannelName} anymore. We need your help to keep the service up and running!`;
    }

    return {
      Title: `Recorder.moe | ${channel.ChannelName}@${channel.Source}`,
      Description,
      Thumbnail: `${BLOB_ENDPOINT_PUBLIC}banner/${channel.Banner}`,
    };
  }
}
