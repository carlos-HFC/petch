import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiParam, ApiTags, ApiQuery, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';

import { Role } from './role.model';
import { RoleService } from './role.service';

@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(
    private roleService: RoleService
  ) { }

  @ApiOkResponse({ type: [Role], description: 'Success' })
  @ApiQuery({ name: 'name', enum: ['Admin', 'Adotante'], required: false })
  @Get()
  async index(@Query('name') name?: string) {
    return await this.roleService.get(name);
  }

  @ApiOkResponse({ type: Role, description: 'Success' })
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
          example: 'Função não encontrada',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @Get(':id')
  async byId(@Param('id') id: number) {
    return await this.roleService.getById(id);
  }
}
