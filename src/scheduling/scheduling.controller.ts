import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req } from '@nestjs/common';
import { Request } from 'express';

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

  @Get(':schedulingTypesId/available')
  async available(@Param('schedulingTypesId') schedulingTypesId: number, @Query('date') date?: string) {
    return await this.schedulingService.availableSchedulings(schedulingTypesId, date);
  }

  @Get(':id')
  async byId(@Param('id') id: number) {
    return await this.schedulingService.findById(id);
  }

  // @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: Request, @Body() data: TCreateScheduling) {
    return await this.schedulingService.post(2, data);
  }

  @Put(':id')
  async cancelSchedule(@Req() req: Request, @Param('id') id: number) {
    return await this.schedulingService.cancelSchedule(2, id);
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