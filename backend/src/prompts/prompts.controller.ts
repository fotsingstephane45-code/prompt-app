import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { AskDto } from './prompts.dto.js';
import { PromptsService } from './prompts.service.js';

@Controller('prompts')
@UseGuards(JwtAuthGuard)
export class PromptsController {
  constructor(private prompts: PromptsService) {}

  @Post()
  ask(@Req() req: any, @Body() dto: AskDto) {
    return this.prompts.ask(req.user.sub, dto.question);
  }
  @Get()
  history(@Req() req: any) {
    return this.prompts.history(req.user.sub);
  }
}