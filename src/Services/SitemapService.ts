import { PublicCosmosdbService } from './PublicCosmosdbService';

export class SitemapService {
  publicCosmosdbService: PublicCosmosdbService;

  constructor() {
    this.publicCosmosdbService = new PublicCosmosdbService();
  }

  async GetSitemap(origin: string): Promise<string> {
    console.log('Start to generate sitemap');
    let channels = await this.publicCosmosdbService.getChannelLists();
    channels = channels.filter((channel) => channel.Hide !== true);
    console.log('Get channels', channels);

    let videos = await this.publicCosmosdbService.getVideoLists();
    videos = videos.filter((video) => channels.some((channel) => channel.id === video.ChannelId));
    console.log('Get videos', videos);

    const urls = channels
      .map((channel) => `${origin}/channels/${channel.id}`)
      .concat(videos.map((video) => `${origin}/channels/${video.ChannelId}/videos/${video.id}`));
    const staticRoutes = `${origin}/
${origin}/channels
${origin}/videos
${origin}/faq
`;
    return staticRoutes + urls.join('\n');
  }
}
