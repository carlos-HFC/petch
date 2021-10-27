import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { IndexOng, Ong, TCreateOng, TFilterOng, TRegisteredOng, TUpdateOng } from './ong.dto';
import { OngService } from './ong.service';
import { config } from '../config/multer';

@ApiTags('ONGs')
@Controller('ongs')
export class OngController {
  constructor(
    private ongService: OngService
  ) { }

  @ApiOperation({ summary: 'Listar todas as ONGs' })
  @ApiOkResponse({ type: [IndexOng], description: 'Success' })
  @Get()
  async index(@Query() query?: TFilterOng) {
    return await this.ongService.get(query);
  }

  @ApiOperation({ summary: 'Listar uma ONG pelo ID' })
  @ApiOkResponse({ type: Ong, description: 'Success' })
  @ApiNotFoundResponse({
    description: 'Not Found',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 404,
        },
        background: {
          type: 'string',
          example: 'error',
        },
        message: {
          type: 'string',
          example: 'ONG não encontrada',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @ApiQuery({ name: 'inactives', type: 'string', enum: ['true', 'false'], required: false })
  @Get(':id')
  async byId(@Param('id') id: number, @Query() { inactives }: Pick<TFilterOng, 'inactives'>) {
    return await this.ongService.findById(id, inactives);
  }

  @ApiOperation({ summary: 'Cadastar uma nova ONG' })
  @ApiCreatedResponse({ type: TRegisteredOng, description: 'Created' })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 400,
        },
        background: {
          type: 'string',
          example: 'error',
        },
        message: {
          oneOf: [
            {
              type: 'string',
              example: 'Arquivo não suportado'
            },
            {
              type: 'string',
              example: 'CEP inválido'
            },
            {
              type: 'string',
              example: 'E-mail inválido'
            },
            {
              type: 'string',
              example: 'Telefone inválido'
            },
            {
              type: 'string',
              example: 'ONG já cadastrada'
            },
            {
              type: 'string',
              example: 'Campo "X" é obrigatório'
            },
          ]
        },
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: TCreateOng })
  @Post()
  @UseInterceptors(FileInterceptor('media', process.env.NODE_ENV === 'dev' ? config : {}))
  async create(@Body() data: TCreateOng, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.ongService.post(data, media);
  }

  @ApiOperation({ summary: 'Editar uma ONG' })
  @ApiOkResponse({ type: TRegisteredOng, description: 'Success' })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 400,
        },
        background: {
          type: 'string',
          example: 'error',
        },
        message: {
          oneOf: [
            {
              type: 'string',
              example: 'Arquivo não suportado'
            },
            {
              type: 'string',
              example: 'CEP inválido'
            },
            {
              type: 'string',
              example: 'E-mail inválido'
            },
            {
              type: 'string',
              example: 'Telefone inválido'
            },
            {
              type: 'string',
              example: 'ONG já cadastrada'
            },
            {
              type: 'string',
              example: 'Campo "X" é obrigatório'
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
          example: 404,
        },
        background: {
          type: 'string',
          example: 'error',
        },
        message: {
          type: 'string',
          example: 'ONG não encontrada',
        },
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: TUpdateOng })
  @Put(':id')
  @UseInterceptors(FileInterceptor('media', process.env.NODE_ENV === 'dev' ? config : {}))
  async update(@Param('id') id: number, @Body() data: TUpdateOng, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.ongService.put(id, data, media);
  }

  @ApiOperation({ summary: 'Ativar e inativar uma ONG' })
  @ApiNoContentResponse({ description: 'No Content' })
  @ApiNotFoundResponse({
    description: 'Not Found',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 404,
        },
        background: {
          type: 'string',
          example: 'error',
        },
        message: {
          type: 'string',
          example: 'ONG não encontrada',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @ApiQuery({ name: 'status', type: 'string', enum: ['true', 'false'], required: true })
  @Delete(':id')
  @HttpCode(204)
  async activeInactive(@Param('id') id: number, @Query('status') status: 'true' | 'false') {
    return await this.ongService.activeInactive(id, status);
  }
}