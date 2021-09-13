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
      templateId: "d-33ea0599dc0948e083afc24ed51c69ab",
      from: "NoReply <projetopetch@gmail.com>"
    };

    try {
      await this.client.send({
        ...envelope,
        personalizations: [
          {
            to: user.email,
            dynamicTemplateData: {
              subject: "Bem-Vindo(a) ao Petch!!",
              name: user.name,
              token: user.tokenVerificationEmail
            }
          }
        ],
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async emailConfirmed(user: User) {
    const envelope = {
      to: user.email,
      from: "NoReply <projetopetch@gmail.com>"
    };

    try {
      await this.client.send({
        ...envelope,
        subject: "Confirmação de e-mail",
        html: `
          <h2>Obrigado</h2>

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

  async newScheduling(user: User, date: string, schedulingTypeName: string) {
    const envelope = {
      to: user.email,
      from: "NoReply <projetopetch@gmail.com>"
    };

    try {
      await this.client.send({
        ...envelope,
        subject: "Agendamento confirmado!!",
        html: `<h2>Agendamento confirmado com sucesso!</h2>

          <p>
            <strong>Olá ${user.name},</strong>
            o seu agendamento para ${schedulingTypeName}, marcado para o dia ${date}, foi confirmado com sucesso
          </p>`
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async cancelScheduling(user: User, date: string, schedulingTypeName: string) {
    const envelope = {
      to: user.email,
      from: "NoReply <projetopetch@gmail.com>"
    };

    try {
      await this.client.send({
        ...envelope,
        subject: "Agendamento cancelado!!",
        html: `<h2>Agendamento cancelado!</h2>

          <p>
            <strong>Olá ${user.name},</strong>
            o seu agendamento para ${schedulingTypeName}, marcado para o dia ${date}, foi cancelado com sucesso
          </p>`
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}