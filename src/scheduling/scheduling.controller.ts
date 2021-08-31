import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';

@Controller('schedulings')
export class SchedulingController {
  constructor(
    private schedulingService: SchedulingService
  ) { }

  @Get()
  async index(@Query() query?: object) {
    return await this.schedulingService.get(query);
  }

  @Get(':id')
  async byId(@Param('id') id: number) {
    return await this.schedulingService.findById(id);
  }

  @Post()
  async create(@Body() data: TCreateScheduling) {
    return await this.schedulingService.post(data);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: object) {
    return await this.schedulingService.put(id, data);
  }

  @Patch(':id')
  async restore(@Param('id') id: number) {
    return await this.schedulingService.restore(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.schedulingService.delete(id);
  }
}