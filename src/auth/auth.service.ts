import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isAfter } from 'date-fns';

import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { createTokenHEX, trimObj, validatePassword } from '../utils';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) { }

  async login(data: TLogin) {
    trimObj(data);

    try {
      const user = await this.userService.findByEmail(data.email);

      if (!user || !(await user.checkPass(data.password))) throw new HttpException('As credenciais estão incorretas', 400);

      if (!user.emailVerified) throw new HttpException('E-mail não verificado', 400);

      const token = this.createTokenJwt(user);

      const { exp } = await this.jwtService.verifyAsync(token);

      return { token, expires: exp * 1000 };
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async validate(payload: { email: string; }) {
    return await this.userService.findByEmail(payload.email);
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.userService.findByEmail(email);

      if (!user) throw new HttpException('Usuário não encontrado', 404);

      const token = createTokenHEX(), now = new Date().setHours(new Date().getHours() + 1);

      await user.update({
        tokenResetPassword: token,
        tokenResetPasswordExpires: now.toString(),
      });

      return { token };
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async resetPassword(data: TResetPassword) {
    trimObj(data);

    try {
      const user = await this.userService.findByEmail(data.email);

      switch (true) {
        case !user:
          throw new HttpException('Usuário não encontrado', 404);
        case !data.token:
          throw new HttpException('Token é obrigatório', 400);
        case data.token !== user.tokenResetPassword:
          throw new HttpException('Token inválido', 400);
        case isAfter(new Date(), Number(user.tokenResetPasswordExpires)):
          throw new HttpException('Token expirou', 400);
        default:
          break;
      }

      if (!data.password) throw new HttpException('Nova senha é obrigatória', 400);

      switch (true) {
        case await user.checkPass(data.password):
          throw new HttpException('Nova senha não pode ser igual a senha atual', 400);
        case data.password && !data.confirmPassword:
          throw new HttpException('Confirmação de senha é obrigatória', 400);
        case data.password !== data.confirmPassword:
          throw new HttpException('Nova senha e confirmação de senha não correspondem', 400);
        default:
          break;
      }

      validatePassword(data.password);

      await user.update({
        ...data,
        tokenResetPassword: null,
        tokenResetPasswordExpires: null,
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async register(data: TCreateUser, media?: Express.MulterS3.File) {
    trimObj(data);

    await this.userService.post(data, false, media);
  }

  private createTokenJwt(user: User) {
    return this.jwtService.sign({ id: user.id, email: user.email, role: user.role.name, cpf: user.cpf, password: user.hash, google: user.googleId });
  }

  async googleLogin(data: TGoogleLogin) {
    trimObj(data);

    try {
      const [userByGoogle, userByEmail] = await Promise.all([
        this.userService.findByGoogleId(data.googleId),
        this.userService.findByEmail(data.email)
      ]);

      if (!userByGoogle && userByEmail) {
        await userByEmail.update({ ...data });

        const token = this.createTokenJwt(userByEmail);

        return { token };
      }

      if (userByGoogle) {
        await userByGoogle.update({ ...data });

        const token = this.createTokenJwt(userByGoogle);

        return { token };
      }
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}