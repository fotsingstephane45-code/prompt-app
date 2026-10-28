import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module.js';
import { Prompt, PromptSchema } from './prompt.schema.js';
import { PromptsController } from './prompts.controller.js';
import { PromptsService } from './prompts.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Prompt.name, schema: PromptSchema }]),
    AuthModule,
  ],
  controllers: [PromptsController],
  providers: [PromptsService],
})
export class PromptsModule {}