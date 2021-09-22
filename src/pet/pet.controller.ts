import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { PetService } from './pet.service';
import { CreatePet, FilterPet, IndexPet, Pet, UpdatePet } from './pet.swagger';
import { config } from '../config/multer';

@ApiTags('Pets')
@Controller('pets')
export class PetController {
  constructor(
    private petService: PetService
  ) { }

  @ApiOperation({ summary: 'Listar todos os pets' })
  @ApiOkResponse({ type: [IndexPet], description: 'Success' })
  @ApiQuery({ type: FilterPet, required: false })
  @Get()
  async index(@Query() query?: TFilterPet) {
    return await this.petService.get(query);
  }

  @ApiOperation({ summary: 'Listar um pet pelo ID' })
  @ApiOkResponse({ type: Pet, description: 'Success' })
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
          example: 'Pet não encontrado',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @ApiQuery({ name: 'inactives', type: 'boolean', required: false })
  @Get(':id')
  async byId(@Param('id') id: number) {
    return await this.petService.findById(id);
  }

  @ApiOperation({ summary: 'Cadastrar um pet' })
  @ApiCreatedResponse({ type: Pet, description: 'Created' })
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
            { example: 'O Pet deve conter uma foto' },
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
            { example: 'ONG não encontrada' },
            { example: 'Espécie não encontrada' },
          ]
        },
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePet })
  @Post()
  @UseInterceptors(FileInterceptor('media', process.env.NODE_ENV === 'dev' ? config : {}))
  async create(@Body() data: TCreatePet, @UploadedFile() media: Express.MulterS3.File) {
    return await this.petService.post(data, media);
  }

  @ApiOperation({ summary: 'Editar um pet' })
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
            { example: 'O Pet deve conter uma foto' },
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
            { example: 'ONG não encontrada' },
            { example: 'Espécie não encontrada' },
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
          example: 'Pet não encontrado',
        },
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdatePet })
  @ApiParam({ name: 'id', required: true })
  @Put(':id')
  @UseInterceptors(FileInterceptor('media', process.env.NODE_ENV === 'dev' ? config : {}))
  async update(@Param('id') id: number, @Body() data: TCreatePet, @UploadedFile() media: Express.MulterS3.File) {
    return await this.petService.put(id, data);
  }

  @ApiOperation({ summary: 'Reativar um pet' })
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
          example: 'Pet não encontrado',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @Patch(':id')
  @HttpCode(204)
  async restore(@Param('id') id: number) {
    return await this.petService.restore(id);
  }

  @ApiOperation({ summary: 'Inativar um pet' })
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
          example: 'Pet não encontrado',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: number) {
    return await this.petService.delete(id);
  }
}