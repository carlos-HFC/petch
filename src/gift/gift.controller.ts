import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

import { Gift } from './gift.model';
import { GiftService } from './gift.service';

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
    return await this.giftService.getById(id);
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
  @ApiBody({ type: Gift })
  @Post()
  @UseInterceptors(FileInterceptor('media'))
  async create(@Body() data: TCreateGift, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.giftService.post(data, media);
  }
}