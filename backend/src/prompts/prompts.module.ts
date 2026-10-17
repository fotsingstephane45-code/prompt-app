import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { Prompt, PromptSchema } from './prompt.schema';
import { PromptsController } from './prompts.controller';
import { PromptsService } from './prompts.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Prompt.name, schema: PromptSchema }]),
    AuthModule,
  ],
  controllers: [PromptsController],
  providers: [PromptsService],
})
export class PromptsModule {}