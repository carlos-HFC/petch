import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { differenceInCalendarYears, isValid, parseISO } from 'date-fns';

import { User } from './user.model';
import { MediaService } from '../medias/media.service';
import { RoleService } from '../role/role.service';
import { createToken, trimObj, validateCEP, validateCPF, validateEmail, validatePassword, validatePhone } from '../utils';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private roleService: RoleService,
    private mediaService: MediaService,
  ) { }

  async get() {
    return await this.userModel.findAll();
  }

  async getById(id: number) {
    const user = await this.userModel.findByPk(id);

    if (!user) throw new HttpException('Usuário não encontrado', 404);

    return user;
  }

  async getByCPF(cpf: string) {
    validateCPF(cpf);

    return await this.userModel.findOne({
      where: {
        cpf: cpf.trim()
      }
    });
  }

  async getByEmail(email: string) {
    validateEmail(email);

    return await this.userModel.findOne({
      where: {
        email: email.trim()
      }
    });
  }

  async post(data: TCreateUser, media?: Express.MulterS3.File) {
    trimObj(data);
    validatePassword(data.password);
    validateCEP(data.cep);
    validatePhone(data.phone);

    if (await this.getByCPF(data.cpf) || await this.getByEmail(data.email)) throw new HttpException('Usuário já cadastrado', 400);

    const birth = parseISO(data.birthday);

    switch (true) {
      case data.password !== data.confirmPassword:
        throw new HttpException('Senhas não correspondem', 400);
      case !isValid(birth):
        throw new HttpException('Data de nascimento inválida', 400);
      case differenceInCalendarYears(Date.now(), birth) < 18:
        throw new HttpException('Você não tem a idade mínima de 18 anos', 400);
      default:
        break;
    }

    const role = await this.roleService.getByName(data.isAdmin ? 'admin' : 'adotante');

    const file = await this.mediaService.post(media);

    const user = await this.userModel.create({
      ...data,
      roleId: role.id,
      mediaId: file.id,
      tokenVerificationEmail: createToken()
    });

    return user;
  }

  async put() { }

  async delete(id: number) {
    const user = await this.getById(id);

    await user.destroy();
  }
}