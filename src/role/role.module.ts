import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeederModule } from 'nestjs-sequelize-seeder';

import { RoleController } from './role.controller';
import { Role } from './role.model';
import { RoleSeed } from './role.seed';
import { RoleService } from './role.service';

@Module({
  imports: [
    SeederModule.forFeature([RoleSeed]),
    SequelizeModule.forFeature([Role])
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule { }
