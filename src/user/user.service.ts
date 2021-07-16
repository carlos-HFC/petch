import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { differenceInCalendarYears, isValid, parseISO } from 'date-fns';

import { User } from './user.model';
import { Media } from '../medias/media.model';
import { MediaService } from '../medias/media.service';
import { RoleService } from '../role/role.service';
import { createToken, trimObj, validateCEP, validateCPF, validateEmail, validatePassword, validatePhone } from '../utils';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private mediaService: MediaService,
    private roleService: RoleService,
  ) { }

  async get() {
    return await this.userModel.findAll();
  }

  async findById(id: number) {
    const user = await this.userModel.findByPk(id);

    if (!user) throw new HttpException('Usuário não encontrado', 404);

    return user;
  }

  async findByCPF(cpf: string) {
    validateCPF(cpf);

    return await this.userModel.findOne({
      where: {
        cpf: cpf.trim()
      }
    });
  }

  async findByEmail(email: string) {
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

    if (await this.findByCPF(data.cpf) || await this.findByEmail(data.email)) throw new HttpException('Usuário já cadastrado', 400);

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

    let file: Media | undefined;
    if (media) file = await this.mediaService.post(media);

    const user = await this.userModel.create({
      ...data,
      roleId: role.id,
      mediaId: file?.id,
      tokenVerificationEmail: createToken()
    });

    return user;
  }

  async put() { }

  async delete(id: number) {
    const user = await this.findById(id);

    await user.destroy();
  }

  async confirmRegister(email: string, tokenVerificationEmail: string) {
    if (!email) throw new HttpException('E-mail não informdo', 400);

    const user = await this.findByEmail(email);

    switch (true) {
      case !user:
        throw new HttpException('Usuário não encontrado', 404);
      case user.emailVerified:
        throw new HttpException('Usuário já confirmado', 400);
      case user.tokenVerificationEmail !== tokenVerificationEmail:
        throw new HttpException('Token inválido', 400);
      default:
        break;
    }

    await user.update({
      tokenVerificationEmail: null,
      emailVerified: true
    });

    return { message: 'Você foi verificado com sucesso!' };
  }
}