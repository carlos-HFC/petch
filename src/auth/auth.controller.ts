import { Body, Controller, HttpCode, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) { }

  @ApiOkResponse({
    description: 'Success',
    schema: {
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

  @Post('/login/google')
  @HttpCode(200)
  async googleLogin(@Body() data: TGoogleLogin) {
    return await this.authService.googleLogin(data);
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('media'))
  async register(@Body() data: TCreateUser, @UploadedFile() media: Express.MulterS3.File) {
    return await this.authService.register(data, media);
  }

  async forgot() { }
  async reset() { }
}