import { Body, Controller, HttpCode, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { GoogleLogin, Login, ResetPassword } from './auth.swagger';
import { CreateUser, User } from '../user/user.swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) { }

  @ApiOperation({ summary: 'Efetuar login com e-mail e senha' })
  @ApiOkResponse({
    description: 'Success',
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          example: '456fda'
        },
        expires: {
          type: 'number',
          example: 126354894809
        },
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
            { example: 'E-mail não verificado' },
          ]
        },
      }
    }
  })
  @ApiBody({ type: Login })
  @Post('login')
  @HttpCode(200)
  async login(@Body() data: TLogin) {
    return await this.authService.login(data);
  }

  @ApiOperation({ summary: 'Efetuar login com Google' })
  @ApiOkResponse({
    description: 'Success',
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          example: '456fda'
        },
        expires: {
          type: 'number',
          example: 126354894809
        },
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
      }
    }
  })
  @ApiBody({ type: GoogleLogin })
  @Post('/login/google')
  @HttpCode(200)
  async googleLogin(@Body() data: TGoogleLogin) {
    return await this.authService.googleLogin(data);
  }

  @ApiOperation({ summary: 'Registrar-se' })
  @ApiCreatedResponse({ type: User, description: 'Created' })
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
            { example: 'Arquivo não suportado' },
            { example: 'Usuário já cadastrado' },
            { example: 'CEP inválido' },
            { example: 'CPF inválido' },
            { example: 'E-mail inválido' },
            { example: 'Número de telefone/celular inválido' },
            { example: 'Senha muito curta' },
            { example: 'Senha precisa ter uma letra maiúscula, uma letra minúscula, um caractere especial e um número' },
            { example: 'Senhas não correspondem' },
            { example: 'Data de nascimento inválida' },
            { example: 'Você não tem a idade mínima de 18 anos' },
          ]
        },
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateUser })
  @Post('register')
  @UseInterceptors(FileInterceptor('media'))
  async register(@Body() data: TCreateUser, @UploadedFile() media: Express.MulterS3.File) {
    return await this.authService.register(data, media);
  }

  @ApiOperation({ summary: 'Solicitar troca de senha por esquecimento' })
  @ApiOkResponse({ description: 'Success' })
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
          example: 'E-mail inválido'
        },
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 404
        },
        message: {
          type: 'string',
          example: 'Usuário não encontrado',
        },
      }
    }
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string'
        }
      }
    }
  })
  @Post('forgot')
  @HttpCode(200)
  async forgot(@Body() data: { email: string; }) {
    return await this.authService.forgotPassword(data.email);
  }

  @ApiOperation({ summary: 'Reiniciar a senha a partir de seu esquecimento' })
  @ApiOkResponse({ description: 'Success' })
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
            { example: 'E-mail inválido' },
            { example: 'Token é obrigatório' },
            { example: 'Token inválido' },
            { example: 'Token expirou' },
            { example: 'Nova senha é obrigatória' },
            { example: 'Nova senha não pode ser igual a senha atual' },
            { example: 'Confirmação de senha é obrigatória' },
            { example: 'Nova senha e confirmação de senha não correspodem' },
            { example: 'Senha muito curta' },
            { example: 'Senha precisa ter uma letra maiúscula, uma letra minúscula, um caractere especial e um número' },
          ]
        },
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 404
        },
        message: {
          type: 'string',
          example: 'Usuário não encontrado',
        },
      }
    }
  })
  @ApiBody({ type: ResetPassword })
  @Post('reset')
  @HttpCode(200)
  async reset(@Body() data: TResetPassword) {
    return await this.authService.resetPassword(data);
  }
}