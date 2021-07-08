import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op as $ } from 'sequelize';

import { Role } from './role.model';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role)
    private readonly roleModel: typeof Role
  ) { }

  async get(type?: string) {
    return await this.roleModel.findAll({
      where: {
        type: {
          [$.startsWith]: type?.trim()
        }
      }
    });
  }

  async getById(id: number) {
    const role = await this.roleModel.findByPk(id);

    if (!role) throw new HttpException("Função não encontrada", 404);

    return role;
  }
}
