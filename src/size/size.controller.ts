import { Body, Controller, Post } from '@nestjs/common';
import { SizeService } from './size.service';

@Controller('sizes')
export class SizeController {
  constructor(
    private sizeService: SizeService
  ) {}

  @Post()
  async create(@Body() data: TCreateSize) {
    return await this.sizeService.post(data)
  }
}