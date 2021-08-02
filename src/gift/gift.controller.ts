import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { GiftService } from './gift.service';
import { CreateGift, FilterGift, Gift, UpdateGift } from './gift.swagger';

@ApiTags('Gifts')
@Controller('gifts')
export class GiftController {
  constructor(
    private giftService: GiftService
  ) { }

  @ApiOkResponse({ type: [Gift], description: 'Success' })
  @ApiQuery({ type: FilterGift, required: false })
  @Get()
  async index(@Query() query: TFilterGift) {
    return await this.giftService.get(query);
  }

  @ApiOkResponse({ type: Gift, description: 'Success' })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 404,
        },
        message: {
          type: 'string',
          example: 'Brinde não encontrado',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @ApiQuery({ name: 'inactives', type: 'boolean', required: false })
  @Get(':id')
  async byId(@Param('id') id: number, @Query('inactives') inactives: boolean) {
    return await this.giftService.findById(id, inactives);
  }

  @ApiCreatedResponse({ type: Gift, description: 'Created' })
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
            { example: 'Campo "X" não pode ser vazio' },
          ]
        },
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateGift })
  @Post()
  @UseInterceptors(FileInterceptor('media'))
  async create(@Body() data: TCreateGift, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.giftService.post(data, media);
  }

  @ApiOperation({ summary: 'Editar um brinde' })
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
            { example: 'Campo "X" não pode ser vazio' },
          ]
        },
      }
    }
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 404,
        },
        message: {
          type: 'string',
          example: 'Brinde não encontrado',
        },
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: UpdateGift })
  @Put(':id')
  @UseInterceptors(FileInterceptor('media'))
  async update(@Param('id') id: number, @Body() data: TUpdateGift, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.giftService.put(id, data, media);
  }

  @ApiNoContentResponse({ description: 'No Content' })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 404,
        },
        message: {
          type: 'string',
          example: 'Brinde não encontrado',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @Patch(':id')
  @HttpCode(204)
  async restore(@Param('id') id: number) {
    return await this.giftService.restore(id);
  }

  @ApiNoContentResponse({ description: 'No Content' })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 404,
        },
        message: {
          type: 'string',
          example: 'Brinde não encontrado',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: number) {
    return await this.giftService.delete(id);
  }
}