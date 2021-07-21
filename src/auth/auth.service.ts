import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { trimObj } from '../utils';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) { }

  async login(data: TLogin) {
    trimObj(data);

    const user = await this.userService.findByEmail(data.email);

    if (!user || !(await user.checkPass(data.password))) throw new HttpException('As credenciais estão incorretas', 400);

    const token = this.createTokenJwt(user);

    return { token };
  }

  async validate(payload: { email: string; }) {
    return await this.userService.findByEmail(payload.email);
  }
  async forgotPassword() { }
  async resetPassword() { }

  async register(data: TCreateUser, media?: Express.MulterS3.File) {
    trimObj(data);

    await this.userService.post(data, false, media);
  }

  private createTokenJwt(user: User) {
    return this.jwtService.sign({ id: user.id, email: user.email, role: user.role.name, cpf: user.cpf, password: user.hash });
  }

  async googleLogin(req: Request) {
    return { user: req.user };
  }
}