import { IVideo } from './Video';

export class Channel implements IChannel {
  id: string = '';
  ChannelName: string = '';
  Source: string = 'Youtube';
  Monitoring: boolean = false;
  Avatar: string = '';
  Banner: string = '';
  LatestVideoId?: string;
  Hide?: boolean;
  UseCookiesFile?: boolean;
  SkipNotLiveStream?: boolean;
  AutoUpdateInfo?: boolean;
  Note?: string;
}

export interface IChannel {
  id: string;
  ChannelName: string;
  Source: string;
  Monitoring: boolean;
  Avatar: string;
  Banner: string;
  LatestVideoId?: string;
  Hide?: boolean;
  UseCookiesFile?: boolean;
  SkipNotLiveStream?: boolean;
  AutoUpdateInfo?: boolean;
  Note?: string;
}

export class ChannelCard extends Channel implements IChannel {
  public LatestVideo?: IVideo;
  public LatestArchivedTime?: number;
}
