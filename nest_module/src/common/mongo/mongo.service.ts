import { Injectable, OnModuleInit } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';

@Injectable()
export class MongoService implements OnModuleInit {
  private client: MongoClient;
  public db: Db;

  async onModuleInit() {
    this.client = await MongoClient.connect(process.env.MONGO_URI || '');
    this.db = this.client.db(); // Default DB from URI
  }

  getCollection(collectionName: string) {
    return this.db.collection(collectionName);
  }
}
