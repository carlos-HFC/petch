import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { endOfDay, format, isAfter, isBefore, isValid, parseISO, setHours, setMinutes, setSeconds, startOfDay, startOfHour, startOfToday, subHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Op as $ } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { TCreateScheduling, TFilterScheduling } from './scheduling.dto';
import { Scheduling } from './scheduling.model';
import { MailService } from '../mail/mail.service';
import { SchedulingTypesService } from '../schedulingTypes/schedulingTypes.service';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { convertBool, trimObj } from '../utils';

@Injectable()
export class SchedulingService {
  constructor(
    @InjectModel(Scheduling)
    private readonly schedulingModel: typeof Scheduling,
    private schedulingTypesService: SchedulingTypesService,
    private mailService: MailService,
    private sequelize: Sequelize,
    private userService: UserService
  ) { }

  async get(query?: TFilterScheduling) {
    trimObj(query);
    const where = {};

    if (query.schedulingTypesId) Object.assign(where, { schedulingTypesId: query.schedulingTypesId });
    if (query.date) Object.assign(where, { date: { [$.between]: [startOfDay(parseISO(query.date)), endOfDay(parseISO(query.date))] } });
    if (convertBool(query.canceled)) Object.assign(where, { canceledAt: { [$.not]: null } });

    return await this.schedulingModel.findAll({ where });
  }

  async mySchedules(userId: number, query?: TFilterScheduling) {
    trimObj(query);
    const where = { userId };

    if (query.schedulingTypesId) Object.assign(where, { schedulingTypesId: query.schedulingTypesId });
    if (query.date) Object.assign(where, { date: { [$.between]: [startOfDay(parseISO(query.date)), endOfDay(parseISO(query.date))] } });

    return await this.schedulingModel.findAll({ where });
  }

  async findById(id: number, userId?: number) {
    const where = { id };

    if (userId) Object.assign(where, { userId });

    const scheduling = await this.schedulingModel.findOne({ where });

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

    await this.schedulingTypesService.getById(schedulingTypesId);

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
      };
    });

    return available;
  }

  async post(user: User, data: TCreateScheduling) {
    trimObj(data);

    if ((await this.userService.userWithPet(user.id)).pets.length === 0) throw new HttpException('Você não adotou um pet para efetuar um agendamento', 400);

    const schedulingType = await this.schedulingTypesService.getById(data.schedulingTypesId);

    if (isBefore(parseISO(data.date), new Date())) throw new HttpException('Data passada não permitida', 400);

    const available = await this.schedulingModel.findOne({
      where: {
        schedulingTypesId: data.schedulingTypesId,
        date: startOfHour(parseISO(data.date)),
        canceledAt: null
      }
    });

    if (available) throw new HttpException('Data de agendamento indisponível', 400);

    const dateFormatted = format(parseISO(data.date), "dd 'de' MMMM 'de' yyyy', às' HH:mm", { locale: ptBR });

    const transaction = await this.sequelize.transaction();

    try {
      await this.schedulingModel.create({
        ...data,
        userId: user.id
      }, { transaction });

      await transaction.commit();

      await this.mailService.newScheduling(user, dateFormatted, schedulingType.name);

      return { message: 'Agendamento marcado com sucesso', background: 'success' };
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async cancelSchedule(user: User, id: number) {
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

    const dateFormatted = format(new Date(), "dd 'de' MMMM 'de' yyyy', às' HH:mm", { locale: ptBR });

    const transaction = await this.sequelize.transaction();

    try {
      await scheduling.update({ canceledAt: new Date() }, { transaction });

      await transaction.commit();

      await this.mailService.cancelScheduling(user, dateFormatted, scheduling.schedulingTypes.name);

      return { message: 'Agendamento cancelado com sucesso', background: 'success' };
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }
}