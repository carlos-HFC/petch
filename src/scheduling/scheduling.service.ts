import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { endOfDay, format, isAfter, isBefore, isValid, parseISO, setHours, setMinutes, setSeconds, startOfDay, startOfHour, startOfToday, subHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Op as $ } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { Scheduling } from './scheduling.model';
import { MailService } from '../mail/mail.service';
import { SchedulingTypesService } from '../schedulingTypes/schedulingTypes.service';
import { User } from '../user/user.model';
import { trimObj } from '../utils';
import { TCreateScheduling } from './scheduling.dto';

@Injectable()
export class SchedulingService {
  constructor(
    @InjectModel(Scheduling)
    private readonly schedulingModel: typeof Scheduling,
    private schedulingTypesService: SchedulingTypesService,
    private mailService: MailService,
    private sequelize: Sequelize
  ) { }

  async get(query?: TFilterScheduling) {
    trimObj(query);

    return await this.schedulingModel.findAll({
      paranoid: !query.inactives
    });
  }

  async findById(id: number, inactives?: boolean) {
    const scheduling = await this.schedulingModel.findByPk(id, { paranoid: !inactives });

    if (!scheduling) throw new HttpException('Agendamento não encontrado', 404);

    return scheduling;
  }

  async availableSchedulings(schedulingTypesId: number, date: string) {
    const schedule = [
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
    ];

    const searchDate = parseISO(date);

    switch (true) {
      case !date:
        throw new HttpException('Data é obrigatória', 400);
      case !isValid(searchDate):
        throw new HttpException('Data inválida', 400);
      case isBefore(startOfDay(searchDate), startOfToday()):
        throw new HttpException('Impossível agendar em uma data passada', 400);
      default:
        break;
    }

    await this.schedulingTypesService.getById(schedulingTypesId)

    const schedulings = await this.schedulingModel.findAll({
      where: {
        schedulingTypesId,
        canceledAt: null,
        date: {
          [$.between]: [startOfDay(searchDate), endOfDay(searchDate)]
        }
      }
    });

    const available = schedule.map(time => {
      const [hour, minute] = time.split(':').map(Number);
      const value = setSeconds(setMinutes(setHours(searchDate, hour), minute), 0);

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available: isAfter(subHours(value, 1), new Date()) && !schedulings.find(sch => format(sch.date, "HH:mm") === time),
        limitHour: format(subHours(value, 1), "HH:mm")
      };
    });

    return available;
  }

  async post(user: User, data: TCreateScheduling) {
    trimObj(data);
    const transaction = await this.sequelize.transaction();

    const date = parseISO(data.date);

    try {
      switch (true) {
        case isBefore(date, new Date()):
          throw new HttpException('Data passada não permitida', 400);
        default:
          break;
      }

      const schedulingType = await this.schedulingTypesService.getById(data.schedulingTypesId);

      const available = await this.schedulingModel.findOne({
        where: {
          schedulingTypesId: data.schedulingTypesId,
          date: startOfHour(date),
          canceledAt: null
        }
      });

      if (available) throw new HttpException('Data de agendamento indisponível', 400);

      const dateFormatted = format(date, "dd 'de' MMMM 'de' yyyy', às' HH:mm", { locale: ptBR });

      await this.mailService.newScheduling(user, dateFormatted, schedulingType.name);

      const scheduling = await this.schedulingModel.create({
        ...data,
        userId: 2
      }, { transaction });

      await transaction.commit();

      return scheduling;
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async cancelSchedule(user: User, id: number) {
    const transaction = await this.sequelize.transaction();

    try {
      const scheduling = await this.schedulingModel.findOne({
        where: {
          id,
          userId: user.id,
          canceledAt: null
        }
      });

      if (!scheduling) throw new HttpException('Agendamento não encontrado', 404);

      const cancelTimeLimit = subHours(scheduling.date, 1);

      if (isBefore(cancelTimeLimit, new Date())) throw new HttpException('Você só pode cancelar um agendamento com uma hora de antecedência', 400);

      const canceledAt = new Date();

      const dateFormatted = format(canceledAt, "dd 'de' MMMM 'de' yyyy', às' HH:mm", { locale: ptBR });

      await scheduling.update({ canceledAt }, { transaction });

      await transaction.commit();

      await this.mailService.cancelScheduling(user, dateFormatted, scheduling.schedulingTypes.name);
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async delete(id: number) {
    const scheduling = await this.findById(id);

    await scheduling.destroy();
  }

  async restore(id: number) {
    const scheduling = await this.findById(id, true);

    await scheduling.restore();
  }
}