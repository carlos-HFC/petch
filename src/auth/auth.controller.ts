import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { GoogleAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) { }

  @ApiOkResponse({
    description: 'Success', schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          example: '456fda'
        }
      }
    }
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 400,
        },
        message: {
          type: 'string',
          oneOf: [
            { example: 'As credenciais estão incorretas' },
            { example: 'E-mail inválido' },
          ]
        },
      }
    }
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
      }
    }
  })
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