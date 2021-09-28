import { Body, Controller, Post } from '@nestjs/common';
import { TCreateSize } from './size.dto';
import { SizeService } from './size.service';

@Controller('sizes')
export class SizeController {
  constructor(
    private sizeService: SizeService
  ) {}

  @Post()
  async create(@Body() data: TCreateSize) {
    // return await this.sizeService.post(data)
  }
}