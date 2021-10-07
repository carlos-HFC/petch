import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request } from 'express';

import { IndexUser, TConfirmRegister, TCreateUser, TFilterUser, TUpdateUser, User } from './user.dto';
import { UserService } from './user.service';
import { RoleDecorator } from '../common/decorators/role.decorator';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { config } from '../config/multer';

@ApiTags('Users')
@ApiUnauthorizedResponse({
  schema: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 401,
      },
      message: {
        type: 'string',
        example: 'Unauthorized'
      }
    }
  }
})
@ApiForbiddenResponse({
  schema: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 403,
      },
      message: {
        type: 'string',
        example: 'Você não tem permissão'
      }
    }
  }
})
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService
  ) { }

  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiOkResponse({ type: [IndexUser], description: 'Success' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleDecorator('admin')
  @Get()
  async index(@Query() query?: TFilterUser) {
    return await this.userService.get(query);
  }

  @ApiOperation({ summary: 'Listar um usuário pelo ID' })
  @ApiOkResponse({ type: User, description: 'Success' })
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
  @ApiQuery({ name: 'inactives', type: 'string', enum: ['true', 'false'], required: false })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleDecorator('admin')
  @Get(':id')
  async byId(@Param('id') id: number, @Query() { inactives }: Pick<TFilterUser, 'inactives'>) {
    return await this.userService.findById(id, inactives);
  }

  @ApiOperation({ summary: 'Cadastrar um novo admin' })
  @ApiCreatedResponse({ type: User, description: 'Created' })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 400,
        },
        message: {
          oneOf: [
            {
              type: 'string',
              example: 'Arquivo não suportado'
            },
            {
              type: 'string',
              example: 'Campo "X" é obrigatório'
            },
            {
              type: 'string',
              example: 'Usuário já cadastrado'
            },
            {
              type: 'string',
              example: 'CEP inválido'
            },
            {
              type: 'string',
              example: 'CPF inválido'
            },
            {
              type: 'string',
              example: 'E-mail inválido'
            },
            {
              type: 'string',
              example: 'Gênero inválido'
            },
            {
              type: 'string',
              example: 'Telefone inválido'
            },
            {
              type: 'string',
              example: 'Data de nascimento inválida'
            },
            {
              type: 'string',
              example: 'Você não tem a idade mínima de 18 anos'
            },
            {
              type: 'string',
              example: 'Senha muito curta'
            },
            {
              type: 'string',
              example: 'Senha precisa ter uma letra maiúscula, uma letra minúscula, um caractere especial e um número'
            },
            {
              type: 'string',
              example: 'Senhas não correspondem'
            },
          ]
        },
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: TCreateUser })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleDecorator('admin')
  @Post()
  @UseInterceptors(FileInterceptor('media', process.env.NODE_ENV === 'dev' ? config : {}))
  async create(@Body() data: TCreateUser, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.userService.post(data, true, media);
  }

  @ApiOperation({ summary: 'Editar os próprios dados' })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 400,
        },
        message: {
          oneOf: [
            {
              type: 'string',
              example: 'Arquivo não suportado'
            },
            {
              type: 'string',
              example: 'Campo "X" não pode ser vazio'
            },
            {
              type: 'string',
              example: 'Usuário já cadastrado'
            },
            {
              type: 'string',
              example: 'CEP inválido'
            },
            {
              type: 'string',
              example: 'CPF inválido'
            },
            {
              type: 'string',
              example: 'E-mail inválido'
            },
            {
              type: 'string',
              example: 'Gênero inválido'
            },
            {
              type: 'string',
              example: 'Telefone inválido'
            },
            {
              type: 'string',
              example: 'Data de nascimento inválida'
            },
            {
              type: 'string',
              example: 'Senha muito curta'
            },
            {
              type: 'string',
              example: 'Senha precisa ter uma letra maiúscula, uma letra minúscula, um caractere especial e um número'
            },
            {
              type: 'string',
              example: 'Senha atual incorreta'
            },
            {
              type: 'string',
              example: 'Nova senha é obrigatória'
            },
            {
              type: 'string',
              example: 'Nova senha não pode ser igual a senha atual'
            },
            {
              type: 'string',
              example: 'Confirmação de senha é obrigatória'
            },
            {
              type: 'string',
              example: 'Nova senha e confirmação de senha não correspondem'
            },
            {
              type: 'string',
              example: 'Você não tem a idade mínima de 18 anos'
            },
          ]
        },
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: TUpdateUser })
  @UseGuards(JwtAuthGuard)
  @Put()
  @UseInterceptors(FileInterceptor('media', process.env.NODE_ENV === 'dev' ? config : {}))
  async update(@Req() req: Request, @Body() data: TUpdateUser, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.userService.put(req.user, data, media);
  }

  @ApiOperation({ summary: 'Confirmar o usuário' })
  @ApiNoContentResponse({ description: 'No Content' })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 400,
        },
        message: {
          oneOf: [
            {
              type: 'string',
              example: 'E-mail é obrigatório'
            },
            {
              type: 'string',
              example: 'E-mail inválido'
            },
            {
              type: 'string',
              example: 'Token não informado'
            },
            {
              type: 'string',
              example: 'Usuário já confirmado'
            },
            {
              type: 'string',
              example: 'Token inválido'
            },
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
  @ApiQuery({ type: TConfirmRegister, required: true })
  @Patch('/confirm')
  async confirmRegister(@Query() data: TConfirmRegister) {
    return await this.userService.confirmRegister(data);
  }

  @ApiOperation({ summary: 'Ativar e inativar um usuário' })
  @ApiNoContentResponse({ description: 'No Content' })
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
  @ApiParam({ name: 'id', required: true })
  @ApiQuery({ name: 'status', type: 'string', enum: ['true', 'false'], required: true })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleDecorator('admin')
  @Delete(':id')
  @HttpCode(204)
  async activeInactive(@Param('id') id: number, @Query('status') status: 'true' | 'false') {
    return await this.userService.activeInactive(id, status);
  }
}