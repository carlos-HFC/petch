import { Body, Controller, Get, Param, Patch, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { User } from './user.model';
import { UserService } from './user.service';
import { CreateUser } from './user.swagger';
import { JwtAuthGuard } from '../auth/auth.guard';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService
  ) { }

  @ApiOkResponse({ type: [User], description: 'Success' })
  @Get()
  async index() {
    return await this.userService.get();
  }

  @ApiOkResponse({ type: [User], description: 'Success' })
  @ApiNotFoundResponse({
    description: 'Not Found',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 404,
        },
        message: {
          type: 'string',
          example: 'Usuário não encontrado',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @Get(':id')
  async byId(@Param('id') id: number) {
    return await this.userService.findById(id);
  }

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
  @Post()
  @UseInterceptors(FileInterceptor('media'))
  async create(@Body() data: TCreateUser, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.userService.post(data, media);
  }

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
  @Put()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('media'))
  async update(@Req() req: Request, @Body() data: TUpdateUser, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.userService.put(req.user, data, media);
  }

  async delete() { }

  @ApiNoContentResponse({ description: 'No Content' })
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
            { example: 'Token inválido' },
            { example: 'Usuário já confirmado' },
            { example: 'E-mail inválido' },
            { example: 'Token não informado' },
            { example: 'E-mail não informado' },
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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        tokenVerificationEmail: {
          type: 'string'
        }
      }
    }
  })
  @ApiQuery({ name: 'email' })
  @Patch('/confirm')
  async confirmRegister(@Query('email') email: string, @Body() data: { tokenVerificationEmail: string; }) {
    return await this.userService.confirmRegister(email, data.tokenVerificationEmail);
  }
}