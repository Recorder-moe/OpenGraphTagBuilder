import { PublicCosmosdbService } from './PublicCosmosdbService';

export class SitemapService {
  publicCosmosdbService: PublicCosmosdbService;

  constructor() {
    this.publicCosmosdbService = new PublicCosmosdbService();
  }

  async GetSitemap(origin: string): Promise<string> {
    const videos = await this.publicCosmosdbService.getVideoLists();
    const channels = await this.publicCosmosdbService.getChannelLists();

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
