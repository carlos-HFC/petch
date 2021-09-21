import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiCreatedResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiBody, ApiBearerAuth, ApiTags, ApiOkResponse, ApiParam, ApiQuery, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request } from 'express';

import { Scheduling, TAvailableScheduling, TCreateScheduling } from './scheduling.dto';
import { SchedulingService } from './scheduling.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RoleDecorator } from '../role/role.decorator';
import { RoleGuard } from '../role/role.guard';

@ApiTags('Schedulings')
@Controller('schedulings')
export class SchedulingController {
  constructor(
    private schedulingService: SchedulingService
  ) { }

  @Get()
  async index(@Query() query?: object) {
    return await this.schedulingService.get(query);
  }

  @ApiOperation({ summary: 'Visualizar datas disponíveis de agendamento' })
  @ApiOkResponse({ type: [TAvailableScheduling], description: 'Success' })
  @ApiBadRequestResponse({
    description: 'Bad Request',
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
            { example: 'Data é obrigatória' },
            { example: 'Data inválida' },
            { example: 'Impossível agendar em uma data passada' },
          ]
        },
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 401,
        },
        message: {
          type: 'string',
          example: 'Unauthorized'
        }
      }
    }
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 403,
        },
        message: {
          type: 'string',
          example: 'Você não tem permissão'
        }
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
          example: 'Tipo de agendamento não encontrado',
        },
      }
    }
  })
  @ApiParam({ name: 'schedulingTypesId', required: true })
  @ApiQuery({ name: 'date', type: 'string', required: true })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleDecorator('adotante')
  @Get(':schedulingTypesId/available')
  async available(@Param('schedulingTypesId') schedulingTypesId: number, @Query('date') date: string) {
    return await this.schedulingService.availableSchedulings(schedulingTypesId, date);
  }

  @Get(':id')
  async byId(@Param('id') id: number) {
    return await this.schedulingService.findById(id);
  }

  @ApiOperation({ summary: 'Cadastrar um novo agendamento' })
  @ApiCreatedResponse({ type: Scheduling, description: 'Created' })
  @ApiBadRequestResponse({
    description: 'Bad Request',
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
            { example: 'Campo "X" é obrigatório' },
            { example: 'Data inválida' },
            { example: 'Data passada não permitida' },
            { example: 'Data de agendamento indisponível' },
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
          example: 'Tipo de agendamento não encontrado',
        },
      }
    }
  })
  @ApiBody({ type: TCreateScheduling })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleDecorator('adotante')
  @Post()
  async create(@Req() req: Request, @Body() data: TCreateScheduling) {
    return await this.schedulingService.post(req.user, data);
  }

  @ApiOperation({ summary: 'Cancelar um agendamento marcado' })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 400,
        },
        message: {
          type: 'string',
          example: 'Você só pode cancelar uma agendamento com uma hora de antecedência'
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
          example: 'Agendamento não encontrado',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleDecorator('adotante')
  @Put(':id')
  async cancelSchedule(@Req() req: Request, @Param('id') id: number) {
    return await this.schedulingService.cancelSchedule(req.user, id);
  }
}