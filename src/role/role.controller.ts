import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';

import { Role } from './role.model';
import { RoleService } from './role.service';

@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(
    private roleService: RoleService
  ) { }

  @ApiResponse({
    type: [Role],
    status: 200,
    description: 'Success',
  })
  @ApiQuery({ name: 'name', enum: ['Admin', 'Adotante'], required: false })
  @Get()
  async index(@Query('name') name?: string) {
    return await this.roleService.get(name);
  }

  @ApiResponse({
    type: Role,
    status: 200,
    description: 'Success',
  })
  @ApiResponse({
    status: 404,
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
