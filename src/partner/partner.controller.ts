import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { PartnerService } from './partner.service';
import { CreatePartner, FilterPartner, Partner, UpdatePartner } from './partner.swagger';

@ApiTags('Partners')
@Controller('partners')
export class PartnerController {
  constructor(
    private partnerService: PartnerService
  ) { }

  @ApiOkResponse({ type: [Partner], description: 'Success' })
  @ApiQuery({ type: FilterPartner, required: false })
  @Get()
  async index(@Query() query?: TFilterPartner) {
    return await this.partnerService.get(query);
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
  @ApiQuery({ name: 'inactives', type: 'boolean', required: false })
  @Get(':id')
  async byId(@Param('id') id: number, @Query('inactives') inactives?: boolean) {
    return await this.partnerService.findById(id, inactives);
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
  @ApiBody({ type: CreatePartner })
  @Post()
  @UseInterceptors(FileInterceptor('media'))
  async create(@Body() data: TCreatePartner, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.partnerService.post(data, media);
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdatePartner })
  @ApiParam({ name: 'id', required: true })
  @Put(':id')
  @UseInterceptors(FileInterceptor('media'))
  async update(@Param('id') id: number, @Body() data: TCreatePartner, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.partnerService.put(id, data, media);
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
  @HttpCode(204)
  async delete(@Param('id') id: number) {
    return await this.partnerService.delete(id);
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
  @Patch(':id')
  @HttpCode(204)
  async restore(@Param('id') id: number) {
    return await this.partnerService.restore(id);
  }
}