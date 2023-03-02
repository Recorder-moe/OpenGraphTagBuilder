export async function handleRequest(request: Request): Promise<Response> {
  const response = await fetch(request)

  if (!response.ok) {
    return response
  }

  const headers = new Headers(response.headers)

  // 检查内容类型是否为HTML
  if (!headers.get('content-type')!.includes('text/html')) {
    return response
  }

  const html = await response.text()
  // 此处可以通过解析 HTML 来获取对应的 meta 标签内容
  const title = 'Recorder.moe'
  const description =
    'Recorder.moe is a live recording service project, the main recording content is Vtuber live video. This project is centered on "video recording service".'

  // 在<head>标记中插入Meta标签
  const metaTags = `
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
`

  // 将 meta 标签插入到页面头部
  const newHtml = html.replace('<head>', `<head>${metaTags}`)

  return new Response(newHtml, {
    status: response.status,
    statusText: response.statusText,
    headers: headers,
  })
}
