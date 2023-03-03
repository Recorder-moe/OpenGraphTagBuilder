export async function handleRequest(request: Request): Promise<Response> {
  const response = await fetch(request)
  const responseClone = response.clone()
  const headers = new Headers(response.headers)

  if (
    response.url.includes('/api/') ||
    request.method !== 'GET' ||
    !response.ok ||
    !headers.get('content-type')?.includes('text/html')
  ) {
    return responseClone
  }

  const html = await response.text()
  if (!html || !html.includes('<head>')) {
    return responseClone
  }

  const title = 'Recorder.moe'
  const description =
    'Recorder.moe is a live recording service project, the main recording content is Vtuber live video. This project is centered on "video recording service".'

  const metaTags = `
    <meta property=\"og:title\" content=\"${title}\">
    <meta property=\"og:description\" content=\"${description}\">
    <meta name=\"twitter:title\" content=\"${title}\">
    <meta name=\"twitter:description\" content=\"${description}\">
    `

  const newHtml = html.replace('<head>', `<head>${metaTags}`)

  return new Response(newHtml, {
    status: response.status,
    statusText: response.statusText,
    headers: headers,
  })
}
