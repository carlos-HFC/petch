import { Body, Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';

import { OngService } from './ong.service';

@Controller('ongs')
export class OngController {
  constructor(
    private ongService: OngService
  ) { }

  @Get()
  async index() {
    return await this.ongService.get();
  }

  @Get(':id')
  async byId(@Param('id') id: number) {
    return await this.ongService.findById(id);
  }

  @Post()
  async create(@Body() data: TCreateOng) {
    return await this.ongService.post(data);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: number) {
    return await this.ongService.delete(id);
  }
}