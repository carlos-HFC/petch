import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SpeciesService } from './species.service';

@Controller('species')
export class SpeciesController {
  constructor(
    private speciesService: SpeciesService
  ) { }

  @Get()
  async index(@Query('name') name?: string) {
    return await this.speciesService.get(name);
  }

  @Get(':id')
  async byId(@Param('id') id: number) {
    return await this.speciesService.getById(id);
  }

  @Post()
  async create(@Body() data: { name: string; }) {
    return await this.speciesService.post(data);
  }
}
