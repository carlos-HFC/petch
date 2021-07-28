import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { OngService } from './ong.service';
import { CreateOng, FilterOng, Ong, UpdateOng } from './ong.swagger';

@ApiTags('ONGs')
@Controller('ongs')
export class OngController {
  constructor(
    private ongService: OngService
  ) { }

  @ApiOkResponse({ type: [Ong], description: 'Success' })
  @ApiQuery({ type: FilterOng, required: false })
  @Get()
  async index(@Query() query?: TFilterOng) {
    return await this.ongService.get(query);
  }

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
        message: {
          type: 'string',
          example: 'ONG não encontrada',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @Get(':id')
  async byId(@Param('id') id: number, @Query('inactives') inactives?: boolean) {
    return await this.ongService.findById(id, inactives);
  }

  @ApiCreatedResponse({ type: Ong, description: 'Created' })
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
            { example: 'CEP inválido' },
            { example: 'E-mail inválido' },
            { example: 'Número de telefone/celular inválido' },
            { example: 'ONG já cadastrada' },
          ]
        },
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateOng })
  @Post()
  @UseInterceptors(FileInterceptor('media'))
  async create(@Body() data: TCreateOng, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.ongService.post(data, media);
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
            { example: 'CEP inválido' },
            { example: 'E-mail inválido' },
            { example: 'Número de telefone/celular inválido' },
            { example: 'ONG já cadastrada' },
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
        message: {
          type: 'string',
          example: 'ONG não encontrada',
        },
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: UpdateOng })
  @Put(':id')
  @UseInterceptors(FileInterceptor('media'))
  async update(@Param('id') id: number, @Body() data: TUpdateOng, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.ongService.put(id, data, media);
  }

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
        message: {
          type: 'string',
          example: 'ONG não encontrada',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: number) {
    return await this.ongService.delete(id);
  }
}