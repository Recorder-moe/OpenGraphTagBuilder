# Cloudflare worker TS Template

## 說明

在push至repo後，使用Github Action部屬至Cloudflare\
所有參數以Github Secrets管理，可在code中以環境變數存取，[範例](src/handler.ts#L2)

## 設定

1. 參閱[Worker手冊](https://developers.cloudflare.com/workers/learning/getting-started)，直至可以建立一般的線上worker\
(Wrangler cli為非必要，但這可以讓你先在本機build過，且tail指令可以接上deployed worker收log)
1. 在github repo中設定以下secrets
   1. CF_ACCOUNT_ID: 由你的Cloudflare Account Home→Workers的右側找到，[或是從wangler cli取得](https://developers.cloudflare.com/workers/learning/getting-started#6-preview-your-project)
   1. CF_API_TOKEN: 由你的Cloudflare Profile→API Token→Create Token產生，[參照說明](https://developers.cloudflare.com/api/tokens/create/)
   1. SOMEENV: 其它Secrets，在此專案中搜尋 `SOMEENV` 以尋找範例和修改處
1. git push to master branch觸發Github Action，建立worker
1. 至Cloudflare Worker設定route

## 參考資料

### Cloudflare Workers documentation

<https://developers.cloudflare.com/workers/>

### Hello World (TypeScript)

<https://github.com/cloudflare/worker-typescript-template>

### Set Up Github Actions: Deploy to Cloudflare Worker

<https://www.serviops.ca/a-full-ci-cd-pipeline-for-cloudflare-workers-with-github-actions/>
