import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { MediaController } from './media.controller';
import { Media } from './media.model';
import { MediaService } from './media.service';
import { UploadService } from '../upload.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Media]),
  ],
  controllers: [MediaController],
  providers: [MediaService, UploadService],
  exports: [MediaService],
})
export class MediaModule { }