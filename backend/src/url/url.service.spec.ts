import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UrlService } from './url.service';
import { Url } from './url.entity';

describe('UrlService', () => {
  let service: UrlService;
  let repository: jest.Mocked<Repository<Url>>;

  const mockUrl: Url = {
    id: 'test-uuid',
    originalUrl: 'https://example.com/very-long-url',
    shortCode: 'ABC123',
    clickCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      increment: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: getRepositoryToken(Url),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
    repository = module.get(getRepositoryToken(Url));
  });

  describe('createShortUrl', () => {
    it('should return existing URL if already shortened', async () => {
      repository.findOne.mockResolvedValueOnce(mockUrl);

      const result = await service.createShortUrl({
        url: 'https://example.com/very-long-url',
      });

      expect(result.originalUrl).toBe(mockUrl.originalUrl);
      expect(result.shortCode).toBe(mockUrl.shortCode);
    });

    it('should create new short URL for new original URL', async () => {
      repository.findOne
        .mockResolvedValueOnce(null) // No existing URL
        .mockResolvedValueOnce(null); // No collision on short code
      repository.create.mockReturnValue(mockUrl);
      repository.save.mockResolvedValue(mockUrl);

      const result = await service.createShortUrl({
        url: 'https://example.com/very-long-url',
      });

      expect(result.originalUrl).toBe(mockUrl.originalUrl);
      expect(result.shortUrl).toContain(mockUrl.shortCode);
    });

    it('should add https:// if protocol is missing', async () => {
      repository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      repository.create.mockImplementation((data) => ({
        ...mockUrl,
        ...data,
      }) as Url);
      repository.save.mockImplementation((entity) =>
        Promise.resolve(entity as Url),
      );

      const result = await service.createShortUrl({
        url: 'example.com/path',
      });

      expect(result.originalUrl).toBe('https://example.com/path');
    });
  });

  describe('getOriginalUrl', () => {
    it('should return original URL and increment click count', async () => {
      repository.findOne.mockResolvedValue(mockUrl);
      repository.increment.mockResolvedValue({ affected: 1, raw: {}, generatedMaps: [] });

      const result = await service.getOriginalUrl('ABC123');

      expect(result).toBe(mockUrl.originalUrl);
      expect(repository.increment).toHaveBeenCalledWith(
        { id: mockUrl.id },
        'clickCount',
        1,
      );
    });

    it('should throw NotFoundException for non-existent short code', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.getOriginalUrl('NOTFOUND')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getUrlStats', () => {
    it('should return URL stats', async () => {
      repository.findOne.mockResolvedValue(mockUrl);

      const result = await service.getUrlStats('ABC123');

      expect(result.shortCode).toBe(mockUrl.shortCode);
      expect(result.clickCount).toBe(mockUrl.clickCount);
    });

    it('should throw NotFoundException for non-existent short code', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.getUrlStats('NOTFOUND')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
