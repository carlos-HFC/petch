import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { GiftService } from './gift.service';

@Controller('gifts')
export class GiftController {
  constructor(
    private giftService: GiftService
  ) { }

  @Get()
  async index() {
    return await this.giftService.get();
  }

  @Get(':id')
  async byId(@Param('id') id: number) {
    return await this.giftService.getById(id);
  }

  @Post()
  async create(@Body() data: TCreateGift) {
    return await this.giftService.post(data)
  }
}