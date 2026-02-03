import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from '../url/url.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USER || 'shortener',
      password: process.env.DATABASE_PASSWORD || 'shortener123',
      database: process.env.DATABASE_NAME || 'url_shortener',
      entities: [Url],
      synchronize: true, // Auto-create tables in dev (disable in production)
      logging: process.env.NODE_ENV === 'development',
    }),
  ],
})
export class DatabaseModule {}
