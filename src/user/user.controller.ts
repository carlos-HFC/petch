import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request } from 'express';

import { UserService } from './user.service';
import { CreateUser, FilterUser, UpdateUser, User } from './user.swagger';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RoleGuard } from '../role/role.guard';
import { RoleDecorator } from '../role/role.decorator';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService
  ) { }

  @ApiOkResponse({ type: [User], description: 'Success' })
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
  @ApiQuery({ type: FilterUser, required: false })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleDecorator('admin')
  @Get()
  async index(@Query() query: TFilterUser) {
    return await this.userService.get(query);
  }

  @ApiOkResponse({ type: [User], description: 'Success' })
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
  @ApiQuery({ name: 'inactives', type: 'boolean', required: false })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleDecorator('admin')
  @Get(':id')
  async byId(@Param('id') id: number, @Query('inactives') inactives: boolean) {
    return await this.userService.findById(id, inactives);
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateUser })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleDecorator('admin')
  @Post()
  @UseInterceptors(FileInterceptor('media'))
  async create(@Body() data: TCreateUser, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.userService.post(data, true, media);
  }

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
            { example: 'Arquivo não suportado' },
            { example: 'Usuário já cadastrado' },
            { example: 'CEP inválido' },
            { example: 'CPF inválido' },
            { example: 'E-mail inválido' },
            { example: 'Número de telefone/celular inválido' },
            { example: 'Senha muito curta' },
            { example: 'Senha precisa ter uma letra maiúscula, uma letra minúscula, um caractere especial e um número' },
            { example: 'Senha atual incorreta' },
            { example: 'Nova senha é obrigatória' },
            { example: 'Nova senha não pode ser igual a senha atual' },
            { example: 'Confirmação de senha é obrigatória' },
            { example: 'Nova senha e confirmação de senha não correspondem' },
            { example: 'Data de nascimento inválida' },
            { example: 'Você não tem a idade mínima de 18 anos' },
          ]
        },
      }
    }
  })
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateUser })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put()
  @UseInterceptors(FileInterceptor('media'))
  async update(@Req() req: Request, @Body() data: TUpdateUser, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.userService.put(req.user, data, media);
  }

  @ApiNoContentResponse({ description: 'No Content' })
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleDecorator('admin')
  @Patch(':id')
  @HttpCode(204)
  async restore(@Param('id') id: number) {
    return await this.userService.restore(id);
  }

  @ApiNoContentResponse({ description: 'No Content' })
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleDecorator('admin')
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: number) {
    return await this.userService.delete(id);
  }

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