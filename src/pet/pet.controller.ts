import { Body, Controller, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { PetService } from './pet.service';

@Controller('pets')
export class PetController {
  constructor(
    private petService: PetService
  ) { }

  @Get()
  async index() {
    return await this.petService.get();
  }

  @Get(':id')
  async byId(@Param('id') id: number) {
    return await this.petService.findById(id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('photos'))
  async create(@Body() data: TCreatePet, @UploadedFiles() images?: Express.MulterS3.File[]) {
    return await this.petService.post(data, images);
  }
}