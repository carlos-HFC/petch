import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService
  ) { }

  @Get()
  async index() {
    return await this.userService.get();
  }

  @Get(':id')
  async byId(@Param('id') id: number) {
    return await this.userService.getById(id);
  }
  async create() { }
  async update() { }
  async delete() { }
}