import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { GiftService } from './gift.service';

@Controller('gifts')
export class GiftController {
  constructor(
    private giftService: GiftService
  ) { }

  @Get()
  async index() {
    return await this.giftService.get();
  }

  @Get(':id')
  async byId(@Param('id') id: number) {
    return await this.giftService.getById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('media'))
  async create(@Body() data: TCreateGift, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.giftService.post(data, media);
  }
}