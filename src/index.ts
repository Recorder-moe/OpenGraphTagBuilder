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

  const html = await response.text();
  if (!html || !html.includes('<head>')) {
    return response;
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

  const metaTags = `
    <title>${metaData.Title}</title>
    <meta name=\"title\" content=\"${metaData.Title}\">
    <meta name=\"description\" content=\"${metaData.Description}\">

    <meta property=\"og:type\" content=\"website\">
    <meta property=\"og:url\" content=\"${url}\">
    <meta property=\"og:title\" content=\"${metaData.Title}\">
    <meta property=\"og:description\" content=\"${metaData.Description}\">
    <meta property=\"og:image\" content=\"${metaData.Thumbnail}\">

    <meta property=\"twitter:card\" content=\"summary_large_image\">
    <meta property=\"twitter:url\" content=\"${url}\">
    <meta property=\"twitter:title\" content=\"${metaData.Title}\">
    <meta property=\"twitter:description\" content=\"${metaData.Description}\">
    <meta property=\"twitter:image\" content=\"${metaData.Thumbnail}\">
    `;
  console.log(metaTags);

  const newHtml = html.replace('</head>', `${metaTags}</head>`);

  return new Response(newHtml, {
    status: response.status,
    statusText: response.statusText,
    headers: headers,
  });
}
