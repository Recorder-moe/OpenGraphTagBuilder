import { IMetaData } from './Models/MetaData';
import { PrepareDataService } from './Services/PrepareDataService';
addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request: Request): Promise<Response> {
  const urlString = request.url;
  const matchResult = urlString.match(/^https?:\/\/[^\/]+(\/.*)$/);

  const url = new URL('https://alpha.recorder.moe' + matchResult![1]);
  // const response = await fetch(request);
  const response = await fetch(url);
  const headers = new Headers(response.headers);

  if (
    url.pathname.startsWith('/api/') ||
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
      temp.Description = `Hey, take a look at this awesome video archive on Recorder.moe!`;
    } else {
      // Channel page
      temp = await prepareDataService.PrepareChannelMetadata(channelId);
      temp.Description = `Check out ${temp.Title}'s recordings on Recorder.moe!`;
    }
    temp.Title = `Recorder.moe | ${temp.Title}}`;
    metaData = { ...metaData, ...temp };
  }

  const metaTags = `
    <title>${metaData.Title}</title>
    <meta name="title" content="${metaData.Title}">
    <meta name="description" content="${metaData.Description}">

    <meta property="og:type" content="website">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${metaData.Title}">
    <meta property="og:description" content="${metaData.Description}">
    <meta property="og:image" content="${metaData.Thumbnail}">

    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${url}">
    <meta property="twitter:title" content="${metaData.Title}">
    <meta property="twitter:description" content="${metaData.Description}">
    <meta property="twitter:image" content="${metaData.Thumbnail}">
    `;

  const newHtml = html.replace('<head>', `<head>${metaTags}`);

  return new Response(newHtml, {
    status: response.status,
    statusText: response.statusText,
    headers: headers,
  });
}
