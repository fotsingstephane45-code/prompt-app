import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AskDto } from './prompts.dto';
import { PromptsService } from './prompts.service';

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