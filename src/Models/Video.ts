import { VideoStatus } from '../enum/VideoStatus';

export class Video implements IVideo {
  public id: string = '';
  public Source: string = 'Youtube';
  public Status: VideoStatus = VideoStatus.Unknown;
  public IsLiveStream?: boolean;
  public Title: string = '';
  public Description?: string;
  public Timestamps: ITimestamps = {};
  public ArchivedTime?: Date;
  public ChannelId: string = '';
  public Thumbnail?: string;
  public Filename?: string;
  public Size?: number;
  public SourceStatus?: VideoStatus;
  public Note?: string;
}

export interface IVideo {
  id: string;
  Source: string;
  Status: VideoStatus;
  IsLiveStream?: boolean;
  Title: string;
  Description?: string;
  Timestamps: ITimestamps;
  ArchivedTime?: Date;
  ChannelId: string;
  Thumbnail?: string;
  Filename?: string;
  Size?: number;
  SourceStatus?: VideoStatus;
  Note?: string;
}

export interface ITimestamps {
  PublishedAt?: Date;
  ScheduledStartTime?: Date;
  ActualStartTime?: Date;
}

export interface IVideoInfo {
  id: string;
  ChannelId: string;
  Title: string;
}
