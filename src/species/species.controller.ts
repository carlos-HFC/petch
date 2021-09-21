import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { SpeciesService } from './species.service';
import { CreateSpecies, FilterSpecies, IndexSpecies, Species, UpdateSpecies } from './species.swagger';
import { config } from '../multer';
import { UpdateSize } from '../size/size.swagger';

@ApiTags('Species')
@Controller('species')
export class SpeciesController {
  constructor(
    private speciesService: SpeciesService
  ) { }

  @ApiOperation({ summary: 'Listar todas as espécies' })
  @ApiOkResponse({ type: [IndexSpecies], description: 'Success' })
  @ApiQuery({ type: FilterSpecies, required: false })
  @Get()
  async index(@Query() query?: TFilterSpecies) {
    return await this.speciesService.get(query);
  }

  @ApiOperation({ summary: 'Listar uma espécie pelo ID' })
  @ApiOkResponse({ type: Species, description: 'Success' })
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
          example: 'Espécie não encontrada',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @ApiQuery({ name: 'inactives', type: 'boolean', required: false })
  @Get(':id')
  async byId(@Param('id') id: number, @Query('inactives') inactives?: boolean) {
    return await this.speciesService.findById(id, inactives);
  }

  @ApiOperation({ summary: 'Cadastrar uma nova espécie' })
  @ApiCreatedResponse({ type: Species, description: 'Created' })
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
            { example: 'Espécie já cadastrada' },
            { example: 'Campo "Nome" não pode ser vazio' },
          ]
        },
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateSpecies })
  @Post()
  @UseInterceptors(FileInterceptor('media', process.env.NODE_ENV === 'dev' ? config : {}))
  async create(@Body() data: TCreateSpecies, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.speciesService.post(data, media);
  }

  @ApiOperation({ summary: 'Editar uma espécie' })
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
            { example: 'Espécie já cadastrada' },
            { example: 'Campo "Nome" não pode ser vazio' },
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
          example: 'Espécie não encontrada',
        },
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateSpecies })
  @ApiParam({ name: 'id', required: true })
  @Put(':id')
  @UseInterceptors(FileInterceptor('media', process.env.NODE_ENV === 'dev' ? config : {}))
  async update(@Param('id') id: number, @Body() data: TUpdateSpecies, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.speciesService.put(id, data, media);
  }

  @ApiOperation({ summary: 'Editar o porte de uma espécie' })
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
            { example: 'Porte já existente para essa espécie' },
            { example: 'Valor inválido' },
            { example: 'Peso Inicial não pode ser maior ou igual ao Peso Final' },
            { example: 'Campo "Nome" não pode ser vazio' },
            { example: 'Campo "Peso Inicial" não pode ser vazio' },
            { example: 'Campo "Peso Final" não pode ser vazio' },
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
          oneOf: [
            { example: 'Espécie não encontrada' },
            { example: 'Porte não encontrado' },
          ]
        },
      }
    }
  })
  @ApiBody({ type: UpdateSize })
  @ApiParam({ name: 'id', required: true })
  @ApiParam({ name: 'sizeId', required: true })
  @Put(':id/size/:sizeId')
  async updateSize(@Param() params: { id: number, sizeId: number; }, @Body() data: TUpdateSize) {
    return await this.speciesService.putSizes(params.id, params.sizeId, data);
  }

  @ApiOperation({ summary: 'Inativar uma espécie' })
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
          example: 'Espécie não encontrada',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: number) {
    return await this.speciesService.delete(id);
  }

  @ApiOperation({ summary: 'Reativar uma espécie' })
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
          example: 'Espécie não encontrada',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @Patch(':id')
  @HttpCode(204)
  async restore(@Param('id') id: number) {
    return await this.speciesService.restore(id);
  }
}
