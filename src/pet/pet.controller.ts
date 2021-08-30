import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, UploadedFiles, UseInterceptors } from '@nestjs/common';
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

  @Put(':id')
  @UseInterceptors(FilesInterceptor('photos'))
  async update(@Param('id') id: number, @Body() data: TCreatePet, @UploadedFiles() images?: Express.MulterS3.File[]) {
    return await this.petService.put(id, data);
  }

  @Patch(':id')
  @HttpCode(204)
  async restore(@Param('id') id: number) {
    return await this.petService.restore(id);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: number) {
    return await this.petService.delete(id);
  }
}