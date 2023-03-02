declare const process: any;
const SOMEENV: string = process.env.SOMEENV;

export async function handleRequest(request: Request): Promise<Response> {
  return new Response(`Environment Variable: ${SOMEENV}`)
}
