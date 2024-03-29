import { IMetaData } from './Models/MetaData';
import { PrepareDataService } from './Services/PrepareDataService';
import { SitemapService } from './Services/SitemapService';
addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const response = await fetch(request);
  const headers = new Headers(response.headers);

  if (url.pathname === '/sitemap.txt') {
    const sitemapService = new SitemapService();
    const sitemap = await sitemapService.GetSitemap(url.origin);
    return new Response(sitemap, {
      headers: {
        'content-type': 'text/plain;charset=UTF-8',
      },
    });
  }

  if (
    request.method !== 'GET' ||
    !response.ok ||
    !headers.get('content-type')?.includes('text/html') ||
    url.pathname.endsWith('json') ||
    url.pathname.endsWith('jsonc') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/assets')
  ) {
    return response;
  }

  let cache = caches.default;
  let cacheResponse = await cache.match(request);
  if (cacheResponse) {
    console.log('Cache hit!');
    return cacheResponse;
  }

  let metaData: IMetaData = {
    Title: 'Recorder.moe - Never miss a Vtuber stream again',
    Description:
      "Recorder.moe is a cool project that record Vtuber live streams on the fly. We're all about helping you capture those important moments in real time.",
    Thumbnail: url.origin + '/assets/img/preview.png',
  };

  console.log(metaData);

  if (url.pathname.startsWith('/channels/')) {
    const path = url.pathname.split('/');
    const channelId = path[2];
    const prepareDataService = new PrepareDataService();
    let temp: IMetaData = {};
    if (url.pathname.includes('/videos/')) {
      const videoId = path[4];
      // Video page
      try {
        temp = await prepareDataService.PrepareVideoMetadata(videoId, channelId);
      } catch (e) {
        console.error(e);

        // Redirect to channel page if video not found
        return Response.redirect(`${url.origin}/channels/${channelId}`, 301);
      }
    } else {
      // Channel page
      try {
        temp = await prepareDataService.PrepareChannelMetadata(channelId);
      } catch (e) {
        console.error(e);

        // Redirect to home page if channel not found
        return Response.redirect(`${url.origin}`, 301);
      }
    }
    console.log('temp', temp);
    metaData = { ...metaData, ...temp };
    console.log('metaData', metaData);
  }

  const rewriter = new HTMLRewriter()
    .on('title', {
      element(element) {
        element.setInnerContent(metaData.Title!);
      },
    })
    .on('meta[name="title"], meta[property="og:title"], meta[property="twitter:title"]', {
      element(element) {
        element.setAttribute('content', metaData.Title!);
      },
    })
    .on(
      'meta[name="description"], meta[property="og:description"], meta[property="twitter:description"]',
      {
        element(element) {
          element.setAttribute('content', metaData.Description!);
        },
      }
    )
    .on('meta[property="og:type"]', {
      element(element) {
        element.setAttribute('content', 'website');
      },
    })
    .on('meta[property="og:url"], meta[property="twitter:url"]', {
      element(element) {
        element.setAttribute('content', url.href);
      },
    })
    .on('meta[property="og:image"], meta[property="twitter:image"]', {
      element(element) {
        element.setAttribute('content', metaData.Thumbnail!);
      },
    })
    .on('meta[property="twitter:card"]', {
      element(element) {
        element.setAttribute('content', 'summary_large_image');
      },
    });

  const newResponse = rewriter.transform(response);

  if (response.status === 200) await cache.put(request, newResponse.clone());

  return newResponse;
}
