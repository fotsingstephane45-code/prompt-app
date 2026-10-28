import { IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { CATEGORIES } from './templates.schema.js';

export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  titre: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  contenu: string;

  @IsIn(CATEGORIES)
  categorie: string;
}