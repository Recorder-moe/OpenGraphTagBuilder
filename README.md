# Open Graph Tag Builder (Cloudflare Worker with GitHub CI/CD)

查詢資料庫並動態產生 Open Graph 資訊和 Sitemap，提供外部預覧和搜索引擎爬蟲使用。使用 GitHub CI 部屬至Cloudflare。

## Setup

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Recorder-moe/OpenGraphTagBuilder)

GitHub repository secrets

- DATABASE_SERVICE: `COUCHDB` or `COSMOSDB`
- COSMOS_KEY: CosmosDB readonly key
- COSMOS_ENDPOINT: Public CosmosDB endpoint. (ex: `https://myaccount.documents.azure.com:443/`)
- COUCH_ENDPOINT: CouchDB endpoint with readonly username:password. (ex: `https://username:password@couchdb.recorder.moe/` ← trailing slash is required)
- BLOB_ENDPOINT_PUBLIC: Public Blob Storage endpoint. Get this from where your public thumbnail images can be accessed. (ex: [This is a image url](https://s3.recorder.moe/livestream-recorder-public/thumbnails/YQ5AlJwVaStk.avif) from our demo site, and this is the setting used here: `https://s3.recorder.moe/livestream-recorder-public/` ← trailing slash is required)

## References

### Cloudflare Workers documentation

<https://developers.cloudflare.com/workers/>

### Azure Cosmos DB client for Cloudflare Workers

<https://www.npmjs.com/package/@cfworker/cosmos>

## LICENSE

> [!WARNING]  
> This *Open Graph Tag Builder* project is licensed under AGPLv3, means that you ***MUST*** open source your project to your *end user* (who can access the website processed by this worker) when you are using this project or using any code from this project. **You can publicly fork this project and provide a link to your repository when users ask for it.**

<img src="https://github.com/Recorder-moe/OpenGraphTagBuilder/assets/16995691/6234ae4e-8d5f-4d06-b716-2cdadeb5da21" alt="open graph" width="200" />

[GNU AFFERO GENERAL PUBLIC LICENSE Version 3](LICENSE)

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
