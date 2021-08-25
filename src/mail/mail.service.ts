import { HttpException, Injectable } from '@nestjs/common';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';

import { User } from '../user/user.model';

@Injectable()
export class MailService {
  constructor(
    @InjectSendGrid()
    private client: SendGridService
  ) { }

  async newUser(user: User) {
    const envelope = {
      to: user.email,
      from: "NoReply <projetopetch@gmail.com>"
    };

    try {
      await this.client.send({
        ...envelope,
        subject: "Bem-Vindo(a) ao Petch!!",
        html: `
          <h1>BEM-VINDO(A) AO PETCH</h1>

          <p>
            <strong>Olá ${user.name},</strong>
            por favor, confirme o seu e-mail com o token abaixo.
          </p>

          <strong>${user.tokenVerificationEmail}</strong>
        `
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async emailConfirmed(user: User) {
    try {
      await this.client.send({
        from: "NoReply <projetopetch@gmail.com>",
        subject: "Confirmação de e-mail",
        to: user.email,
        html: `
          <h3>Obrigado</h3>

          <p>
            <strong>Olá ${user.name},</strong>
            seu e-mail foi confirmado com sucesso!
          </p>
        `
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}