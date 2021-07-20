import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { Species } from './species.model';
import { SpeciesService } from './species.service';

@ApiTags('Species')
@Controller('species')
export class SpeciesController {
  constructor(
    private speciesService: SpeciesService
  ) { }

  @ApiOkResponse({ type: [Species], description: 'Success' })
  @ApiQuery({ name: 'name', required: false })
  @Get()
  async index(@Query('name') name?: string) {
    return await this.speciesService.get(name);
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
  @Get(':id')
  async byId(@Param('id') id: number) {
    return await this.speciesService.getById(id);
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
          example: 'Espécie já cadastrada'
        },
      }
    }
  })
  @ApiBody({ type: Species })
  @Post()
  async create(@Body() data: { name: string; }) {
    return await this.speciesService.post(data);
  }
}
