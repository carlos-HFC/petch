import { Controller, Get, Param, Query } from '@nestjs/common';

import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(
    private roleService: RoleService
  ) { }

  @Get()
  async index(@Query('name') name?: string) {
    return await this.roleService.get(name);
  }

  @Get(':id')
  async byId(@Param('id') id: number) {
    return await this.roleService.getById(id);
  }
}
