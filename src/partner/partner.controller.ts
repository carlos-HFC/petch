import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { PartnerService } from './partner.service';

@Controller('partners')
export class PartnerController {
  constructor(
    private partnerService: PartnerService
  ) { }

  @Get()
  async index() {
    return await this.partnerService.get();
  }

  @Get(':id')
  async byId(@Param('id') id: number) {
    return await this.partnerService.getById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('media'))
  async create(@Body() data: TCreatePartner, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.partnerService.post(data, media);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.partnerService.delete(id);
  }
}