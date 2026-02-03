import { Module } from '@nestjs/common';

import { UrlModule } from './url/url.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, UrlModule],
})
export class AppModule {}
