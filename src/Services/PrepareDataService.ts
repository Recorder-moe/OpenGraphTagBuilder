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

    const { SourceStatus, Status } = video;
    const sourceNotExist =
      (SourceStatus ?? 0) >= VideoStatus.Expired && SourceStatus !== VideoStatus.Exist;
    const archived = Status >= VideoStatus.Archived && Status < VideoStatus.Expired;
    const scheduled = Status >= VideoStatus.Scheduled && Status < VideoStatus.Archived;
    const expired = Status === VideoStatus.Expired;
    const notArchived = !archived && !scheduled;

    const messages = {
      default: 'Hey, take a look at this awesome video archive on Recorder.moe!😎',
      archivedAndSourceNotExist:
        "We've got your back! The video may be gone, but we've archived it for you.💪",
      expired:
        'Oops, this video is no longer available as it was archived on Recorder.moe more than 30 days ago.😕',
      notExist: "Sorry, this video can't be found on Recorder.moe.😥",
      scheduled:
        "This video isn't available in our archive just yet, but don't worry - we're keeping an eye on it for you!👀",
    };

    let Description = messages.default;

    if (archived && sourceNotExist) {
      Description = messages.archivedAndSourceNotExist;
    } else if (expired) {
      Description = messages.expired;
    } else if (sourceNotExist || notArchived) {
      Description = messages.notExist;
    } else if (scheduled) {
      Description = messages.scheduled;
    }

    return {
      Title: `Recorder.moe | ${video.Title} | ${channel.ChannelName}`,
      Description,
      Thumbnail: `${BLOB_ENDPOINT_PUBLIC}thumbnails/${video.Thumbnail}`,
    };
  }

  async PrepareChannelMetadata(channelId: string): Promise<IMetaData> {
    const channel = await this.publicCosmosdbService.getChannelById(channelId);
    const { ChannelName, Monitoring } = channel;

    const messages = {
      monitoring: `Recorder.moe is keeping an eye on ${ChannelName}'s livestream! We're all about helping you capture those important moments in real time.👀`,
      notMonitoring: `Hey there! Recorder.moe is not monitoring ${ChannelName} anymore. We need your help to keep the service up and running!🙏`,
    };

    const Description = Monitoring ? messages.monitoring : messages.notMonitoring;

    return {
      Title: `Recorder.moe | ${channel.ChannelName}@${channel.Source}`,
      Description,
      Thumbnail: `${BLOB_ENDPOINT_PUBLIC}banner/${channel.Banner}`,
    };
  }
}
