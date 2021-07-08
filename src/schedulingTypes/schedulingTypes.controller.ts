import { Controller, Get, Param, Query } from '@nestjs/common';
import { SchedulingTypesService } from './schedulingTypes.service';

@Controller('schedulingTypes')
export class SchedulingTypesController {
  constructor(
    private schedulingTypesService: SchedulingTypesService
  ) { }

  @Get()
  async index(@Query('name') name?: string) {
    return await this.schedulingTypesService.get(name);
  }

  @Get(':id')
  async byId(@Param('id') id: number) {
    return await this.schedulingTypesService.getById(id);
  }
}
