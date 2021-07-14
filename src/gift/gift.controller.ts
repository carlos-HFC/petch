import { Controller, Get, Param } from '@nestjs/common';

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
}