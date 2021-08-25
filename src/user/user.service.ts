import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { randomBytes } from 'crypto';
import { differenceInCalendarYears, isValid, parseISO } from 'date-fns';
import { Op as $ } from 'sequelize';

import { User } from './user.model';
import { MailService } from '../mail/mail.service';
import { RoleService } from '../role/role.service';
import { UploadService } from '../upload.service';
import { createTokenHEX, trimObj, validateCEP, validateCPF, validateEmail, validatePassword, validatePhone } from '../utils';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private roleService: RoleService,
    private uploadService: UploadService,
    private mailService: MailService
  ) { }

  async get(query?: TFilterUser) {
    const where = {};

    if (query.uf) Object.assign(where, { uf: query.uf.toUpperCase() });
    if (query.gender) Object.assign(where, { gender: query.gender.toUpperCase() });
    if (query.googleId) Object.assign(where, { googleId: { [$.not]: null } });

    return await this.userModel.findAll({
      paranoid: !query.inactives,
      where
    });
  }

  async findById(id: number, inactives?: boolean) {
    const user = await this.userModel.findByPk(id, { paranoid: !inactives });

    if (!user) throw new HttpException('Usuário não encontrado', 404);

    return user;
  }

  async findByGoogleId(googleId: string) {
    return await this.userModel.findOne({
      where: {
        googleId: googleId.trim()
      }
    });
  }

  async findByCPF(cpf: string) {
    validateCPF(cpf);

    return await this.userModel.findOne({
      where: {
        cpf: cpf.replace(/[\s-.]/g, '')
      }
    });
  }

  async findByEmail(email: string) {
    validateEmail(email);

    return await this.userModel.findOne({
      where: {
        email: email.trim().toLowerCase()
      }
    });
  }

  async post(data: TCreateUser, isAdmin: boolean, media?: Express.MulterS3.File) {
    trimObj(data);

    try {
      if (data.cep) validateCEP(data.cep);
      if (data.phone) validatePhone(data.phone);

      if (await this.findByCPF(data.cpf) || await this.findByEmail(data.email)) throw new HttpException('Usuário já cadastrado', 400);

      const birth = parseISO(data.birthday);

      if (!isAdmin) {
        if (data.password && data.password !== data.confirmPassword) throw new HttpException('Senhas não correspondem', 400);
        validatePassword(data.password);

        if (!data.googleId) throw new HttpException('A senha é obrigatória', 400);
      }

      if (isAdmin) data.password = randomBytes(5).toString('hex');

      switch (true) {
        case !isValid(birth):
          throw new HttpException('Data de nascimento inválida', 400);
        case differenceInCalendarYears(Date.now(), birth) < 18:
          throw new HttpException('Você não tem a idade mínima de 18 anos', 400);
        default:
          break;
      }

      const role = await this.roleService.getByName(isAdmin ? 'admin' : 'adotante');

      if (media) {
        const avatar = (await this.uploadService.uploadFile(media)).url;
        Object.assign(data, { avatar });
      }

      const user = await this.userModel.create({
        ...data,
        roleId: role.id,
        tokenVerificationEmail: createTokenHEX()
      });

      return user;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async put(user: User, data: TUpdateUser, media?: Express.MulterS3.File) {
    trimObj(data);

    try {
      if (data.cep) validateCEP(data.cep);
      if (data.phone) validatePhone(data.phone);

      if (data.email && data.email !== user.email) {
        if (await this.findByEmail(data.email)) throw new HttpException('Usuário já cadastrado', 400);
      }

      if (data.cpf && data.cpf !== user.cpf) {
        if (await this.findByCPF(data.cpf)) throw new HttpException('Usuário já cadastrado', 400);
      }

      switch (true) {
        case data.birthday && !isValid(parseISO(data.birthday)):
          throw new HttpException('Data de nascimento inválida', 400);
        case data.birthday && differenceInCalendarYears(new Date(), parseISO(data.birthday)) < 18:
          throw new HttpException('Você não tem a idade mínima de 18 anos', 400);
        default:
          break;
      }

      if (data.oldPassword) {
        const { oldPassword, password, confirmPassword } = data;

        switch (true) {
          case !(await user.checkPass(oldPassword)):
            throw new HttpException('Senha atual incorreta', 400);
          case !password:
            throw new HttpException('Nova senha é obrigatória', 400);
          case oldPassword === password:
            throw new HttpException('Nova senha não pode ser igual a senha atual', 400);
          case password && !confirmPassword:
            throw new HttpException('Confirmação de senha é obrigatória', 400);
          case password !== confirmPassword:
            throw new HttpException('Nova senha e confirmação de senha não correspondem', 400);
          default:
            break;
        }

        validatePassword(password);
      }

      if (media) {
        const avatar = (await this.uploadService.uploadFile(media)).url;
        Object.assign(data, { avatar });
      }

      await user.update({
        ...data,
        emailVerified: data.email && false,
        tokenVerificationEmail: data.email && createTokenHEX(),
      });

      if (data.email) await this.mailService.newUser(user);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async delete(id: number) {
    const user = await this.findById(id);

    await user.destroy();
  }

  async restore(id: number) {
    const user = await this.findById(id, true);

    await user.restore();
  }

  async confirmRegister(email: string, tokenVerificationEmail: string) {
    if (!email) throw new HttpException('E-mail não informdo', 400);
    if (!tokenVerificationEmail) throw new HttpException('Token não informdo', 400);

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

    await this.mailService.emailConfirmed(user);
  }
}