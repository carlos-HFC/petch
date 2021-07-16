import { Body, Controller, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
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
    return await this.userService.findById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('media'))
  async create(@Body() data: TCreateUser, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.userService.post(data, media);
  }

  async update() { }
  async delete() { }

  @Put('/confirm')
  async confirmRegister(@Query('email') email: string, @Body() data: { tokenVerificationEmail: string; }) {
    return await this.userService.confirmRegister(email, data.tokenVerificationEmail);
  }
}