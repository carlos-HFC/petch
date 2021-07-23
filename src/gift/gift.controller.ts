import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

import { GiftService } from './gift.service';
import { CreateGift, Gift, UpdateGift } from './gift.swagger';

@ApiTags('Gifts')
@Controller('gifts')
export class GiftController {
  constructor(
    private giftService: GiftService
  ) { }

  @ApiOkResponse({ type: [Gift], description: 'Success' })
  @Get()
  async index() {
    return await this.giftService.get();
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
  @Get(':id')
  async byId(@Param('id') id: number) {
    return await this.giftService.findById(id);
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
          example: 'Arquivo não suportado'
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
          example: 'Arquivo não suportado'
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
  @ApiParam({ name: 'id', required: true })
  @ApiConsumes('multipart/form-data')
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
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: number) {
    return await this.giftService.delete(id);
  }
}