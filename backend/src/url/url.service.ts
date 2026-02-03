import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUrlDto } from './dto/create-url.dto';
import { UrlResponseDto } from './dto/url-response.dto';

import { Url } from './url.entity';

@Injectable()
export class UrlService {
  private readonly BASE_URL = process.env.BASE_URL || 'http://localhost:3001';
  private readonly SHORT_CODE_LENGTH = 6;
  private readonly BASE_62 =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
  ) {}

  async createShortUrl(createUrlDto: CreateUrlDto): Promise<UrlResponseDto> {
    const normalizedUrl = this.normalizeUrl(createUrlDto.url);

    const existingUrl = await this.urlRepository.findOne({
      where: { originalUrl: normalizedUrl },
    });

    if (existingUrl) {
      return this.formatUrlToResponseDto(existingUrl);
    }

    const shortCode = await this.generateUniqueShortCode();

    const url = this.urlRepository.create({
      originalUrl: normalizedUrl,
      shortCode,
    });

    const savedUrl = await this.urlRepository.save(url);
    return this.formatUrlToResponseDto(savedUrl);
  }

  async getOriginalUrl(shortCode: string): Promise<string> {
    const url = await this.urlRepository.findOne({
      where: { shortCode },
    });

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    this.incrementClickCount(url.id);

    return url.originalUrl;
  }

  async getUrlStats(shortCode: string): Promise<UrlResponseDto> {
    const url = await this.urlRepository.findOne({
      where: { shortCode },
    });

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    return this.formatUrlToResponseDto(url);
  }

  private async incrementClickCount(id: string): Promise<void> {
    await this.urlRepository.increment({ id }, 'clickCount', 1);
  }

  private generateShortCode(): string {
    let code = '';
    for (let i = 0; i < this.SHORT_CODE_LENGTH; i++) {
      const randomIndex = Math.floor(Math.random() * this.BASE_62.length);
      code += this.BASE_62[randomIndex];
    }
    return code;
  }

  private async generateUniqueShortCode(): Promise<string> {
    const maxAttempts = 10;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const shortCode = this.generateShortCode();
      const existing = await this.urlRepository.findOne({
        where: { shortCode },
      });

      if (!existing) {
        return shortCode;
      }
      attempts++;
    }

    throw new ConflictException(
      'Unable to generate unique short code. Please try again.',
    );
  }

  private normalizeUrl(url: string): string {
    // Ensure URL has a protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  }

  private formatUrlToResponseDto(url: Url): UrlResponseDto {
    return {
      id: url.id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl: `${this.BASE_URL}/${url.shortCode}`,
      clickCount: url.clickCount,
      createdAt: url.createdAt,
    };
  }
}
