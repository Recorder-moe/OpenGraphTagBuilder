declare const process: any;
const DATABASE_SERVICE: string = process.env.DATABASE_SERVICE;

import { CosmosDBService } from '../Services/db/CosmosDBService';
import { CouchDBService } from '../Services/db/CouchDBService';
import { IDBService } from './../interface/IDBService';
export class IDBServiceProvider {
  static getDBService(): IDBService {
    switch (DATABASE_SERVICE) {
      case 'COUCHDB':
        return new CouchDBService();
      case 'COSMOSDB':
        return new CosmosDBService();
      default:
        throw new Error('No DB Service Found');
    }
  }
}
