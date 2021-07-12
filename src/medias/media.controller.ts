import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { MediaService } from './media.service';

@Controller('medias')
export class MediaController {
  constructor(
    private mediaService: MediaService
  ) { }

  @Get()
  async index() {
    return await this.mediaService.get();
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.MulterS3.File) {
    return await this.mediaService.post(file);
  }
}