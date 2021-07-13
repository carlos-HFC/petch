import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService
  ) { }

  @Get()
  async index() {
    return await this.userService.get();
  }

  @Get(':id')
  async byId(@Param('id') id: number) {
    return await this.userService.getById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('media'))
  async create(@Body() data: TCreateUser, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.userService.post(data, media);
  }
  async update() { }
  async delete() { }
}