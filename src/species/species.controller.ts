import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { SpeciesService } from './species.service';
import { CreateSpecies, FilterSpecies, Species } from './species.swagger';

@ApiTags('Species')
@Controller('species')
export class SpeciesController {
  constructor(
    private speciesService: SpeciesService
  ) { }

  @ApiOkResponse({ type: [Species], description: 'Success' })
  @ApiQuery({ type: FilterSpecies, required: false })
  @Get()
  async index(@Query() query?: TFilterSpecies) {
    return await this.speciesService.get(query);
  }

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
  @UseInterceptors(FileInterceptor('media'))
  async create(@Body() data: TCreateSpecies, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.speciesService.post(data, media);
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
  @ApiBody({ type: Species })
  @ApiParam({ name: 'id', required: true })
  @Put(':id')
  @UseInterceptors(FileInterceptor('media'))
  async update(@Param('id') id: number, @Body() data: TUpdateSpecies, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.speciesService.put(id, data, media);
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
