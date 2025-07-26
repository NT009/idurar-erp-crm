import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { CreateWebhookQueryDto } from './dto/queries.dto';

@Controller()
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Get('reports/summary')
  @HttpCode(HttpStatus.OK)
  async getSummary() {
    return await this.integrationService.getSummary();
  }
  @Post('webhook')
  async createQueryViaWebhook(@Body() dto: CreateWebhookQueryDto) {
    return await this.integrationService.createQuery(dto);
  }
}
