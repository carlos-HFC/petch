import { Body, Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

import { Ong } from './ong.model';
import { OngService } from './ong.service';

@ApiTags('ONGs')
@Controller('ongs')
export class OngController {
  constructor(
    private ongService: OngService
  ) { }

  @ApiOkResponse({ type: [Ong], description: 'Success' })
  @Get()
  async index() {
    return await this.ongService.get();
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
  async byId(@Param('id') id: number) {
    return await this.ongService.findById(id);
  }

  @Post()
  async create(@Body() data: TCreateOng) {
    return await this.ongService.post(data);
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