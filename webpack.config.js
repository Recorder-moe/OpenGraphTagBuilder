const path = require('path')
const webpack = require('webpack')

const mode = process.env.NODE_ENV || 'production'

module.exports = {
  output: {
    filename: `worker.${mode}.js`,
    path: path.join(__dirname, 'dist'),
  },
  mode,
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      // COUCHDB or COSMOSDB
      DATABASE_SERVICE: 'COUCHDB',
      // Azure CosmosDB Read-only Key!!!
      COSMOS_KEY: '',
      // Database endpoint
      // Be sure to use a readonly account for CouchDB!!!
      COSMOS_ENDPOINT: 'https://recordermoe.documents.azure.com:443/',
      COUCH_ENDPOINT: 'https://username:password@couchdb.recorder.moe/',
      // Blob storage / S3 endpoint
      // https://myaccount.blob.core.windows.net/mycontainer
      // https://s3.recorder.moe/mycontainer
      BLOB_ENDPOINT_PUBLIC: '',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
  devtool: 'source-map',
};