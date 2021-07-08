import { Controller, Get, Param, Query } from '@nestjs/common';
import { SolicitationTypesService } from './solicitationTypes.service';

@Controller('solicitationTypes')
export class SolicitationTypesController {
  constructor(
    private solicitationTypesService: SolicitationTypesService
  ) { }

  @Get()
  async index(@Query('name') name?: string) {
    return await this.solicitationTypesService.get(name);
  }

  @Get(':id')
  async byId(@Param('id') id: number) {
    return await this.solicitationTypesService.getById(id);
  }
}
