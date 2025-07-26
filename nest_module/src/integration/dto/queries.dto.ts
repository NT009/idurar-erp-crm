// dto/create-webhook-query.dto.ts
import { IsString, IsNotEmpty, IsMongoId, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class NoteDto {
  @IsString()
  @IsNotEmpty()
  note: string;
}

export class CreateWebhookQueryDto {
  // @IsMongoId()
  // client: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  status?: 'Open' | 'InProgress' | 'Closed';

  @IsOptional()
  @IsString()
  resolution?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NoteDto)
  notes?: NoteDto[];

  // @IsMongoId()
  // createdBy?: string;

  // @IsOptional()
  // @IsMongoId()
  // assigned?: string;
}
