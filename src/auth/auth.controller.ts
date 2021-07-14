import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { GoogleAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) { }

  @Post('login')
  @HttpCode(200)
  async login(@Body() data: TLogin) {
    return await this.authService.login(data);
  }

  async forgot() { }
  async reset() { }

  @UseGuards(GoogleAuthGuard)
  @Get('/google')
  async googleAuth(@Req() req: Request) { }

  @UseGuards(GoogleAuthGuard)
  @Get('/google/redirect')
  async googleAuthRedirect(@Req() req: Request) {
    return await this.authService.googleLogin(req);
  }
}