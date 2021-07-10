import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User
  ) { }

  async get() {
    return await this.userModel.findAll();
  }

  async getById(id: number) {
    const user = await this.userModel.findByPk(id);

    if (!user) throw new HttpException('Usuário não encontrado', 404);

    return user;
  }

  async getByEmail(email: string) {
    return await this.userModel.findOne({ where: { email } });
  }

  async post() { }
  async put() { }
  async delete() { }
}