import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { UrlResponseDto } from './dto/url-response.dto';
import { CreateUrlDto } from './dto/create-url.dto';

import { UrlService } from './url.service';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('api/shorten')
  async createShortUrl(
    @Body() createUrlDto: CreateUrlDto,
  ): Promise<UrlResponseDto> {
    return this.urlService.createShortUrl(createUrlDto);
  }

  @Get('api/stats/:shortCode')
  async getUrlStats(
    @Param('shortCode') shortCode: string,
  ): Promise<UrlResponseDto> {
    return this.urlService.getUrlStats(shortCode);
  }

  @Get(':shortCode')
  async redirect(
    @Param('shortCode') shortCode: string,
    @Res() res: Response,
  ): Promise<void> {
    const originalUrl = await this.urlService.getOriginalUrl(shortCode);
    res.redirect(HttpStatus.MOVED_PERMANENTLY, originalUrl);
  }
}
