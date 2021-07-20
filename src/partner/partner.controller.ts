import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { Partner } from './partner.model';

import { PartnerService } from './partner.service';

@ApiTags('Partners')
@Controller('partners')
export class PartnerController {
  constructor(
    private partnerService: PartnerService
  ) { }

  @ApiOkResponse({ type: [Partner], description: 'Success' })
  @Get()
  async index() {
    return await this.partnerService.get();
  }

  @ApiOkResponse({ type: Partner, description: 'Success' })
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
          example: 'Parceiro não encontrado',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @Get(':id')
  async byId(@Param('id') id: number) {
    return await this.partnerService.findById(id);
  }

  @ApiCreatedResponse({ type: Partner, description: 'Created' })
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
  @ApiBody({ type: Partner })
  @Post()
  @UseInterceptors(FileInterceptor('media'))
  async create(@Body() data: TCreatePartner, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.partnerService.post(data, media);
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
          example: 'Parceiro não encontrado',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.partnerService.delete(id);
  }
}