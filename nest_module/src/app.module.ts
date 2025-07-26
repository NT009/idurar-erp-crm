import { Module } from '@nestjs/common';
import { IntegrationModule } from './integration/integration.module';
import * as dotenv from 'dotenv';
import { MongoService } from './common/mongo/mongo.service';
dotenv.config();

@Module({
  imports: [
    IntegrationModule,
  ],
  providers: [MongoService],
  exports: [MongoService],
})
export class AppModule {}
