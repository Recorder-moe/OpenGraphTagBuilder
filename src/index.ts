import { IMetaData } from './Models/MetaData';
import { PrepareDataService } from './Services/PrepareDataService';
addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const response = await fetch(request);
  const headers = new Headers(response.headers);

  if (
    request.method !== 'GET' ||
    !response.ok ||
    !headers.get('content-type')?.includes('text/html')
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
    Thumbnail: url.origin + '/assets/img/page.png',
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
      temp = await prepareDataService.PrepareVideoMetadata(videoId, channelId);
    } else {
      // Channel page
      temp = await prepareDataService.PrepareChannelMetadata(channelId);
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
  await cache.put(request, newResponse.clone());

  return newResponse;
}
