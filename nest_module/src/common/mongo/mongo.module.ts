import { Module } from "@nestjs/common";
import { MongoService } from "./mongo.service";

@Module({
  providers: [MongoService],
  exports: [MongoService], // 👈 required so other modules can use it
})
export class MongoModule {}
