import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { SchedulingTypes } from './schedulingTypes.model';
import { SchedulingTypesService } from './schedulingTypes.service';

@ApiTags('Scheduling Types')
@Controller('schedulingTypes')
export class SchedulingTypesController {
  constructor(
    private schedulingTypesService: SchedulingTypesService
  ) { }

  @ApiOkResponse({ type: [SchedulingTypes], description: 'Success' })
  @ApiQuery({ name: 'name', enum: ['Vacina', 'Banho', 'Medicação'], required: false })
  @Get()
  async index(@Query('name') name?: string) {
    return await this.schedulingTypesService.get(name);
  }

  @ApiOkResponse({ type: SchedulingTypes, description: 'Success' })
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
          example: 'Tipo de agendamento não encontrada',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @Get(':id')
  async byId(@Param('id') id: number) {
    return await this.schedulingTypesService.getById(id);
  }
}
