import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CreateTemplateDto } from './templates.dto.js';
import { TemplatesService } from './templates.service.js';

@Controller('templates')
@UseGuards(JwtAuthGuard)
export class TemplatesController {
  constructor(private templates: TemplatesService) {}

  @Get()
  list(@Req() req: any, @Query('search') search?: string, @Query('categorie') categorie?: string) {
    return this.templates.list(req.user.sub, search, categorie);
  }

  @Get('mine')
  mine(@Req() req: any) {
    return this.templates.mine(req.user.sub);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateTemplateDto) {
    return this.templates.create(req.user.sub, dto);
  }

  @Post(':id/like')
  like(@Req() req: any, @Param('id') id: string) {
    return this.templates.like(req.user.sub, id);
  }

  @Post(':id/save')
  save(@Req() req: any, @Param('id') id: string) {
    return this.templates.save(req.user.sub, id);
  }
}