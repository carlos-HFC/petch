import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { endOfDay, format, isAfter, isBefore, isValid, parseISO, setHours, setMinutes, setSeconds, startOfDay, startOfHour, startOfToday, subHours } from 'date-fns';
import { Op as $ } from 'sequelize';

import { Scheduling } from './scheduling.model';
import { SchedulingTypesService } from '../schedulingTypes/schedulingTypes.service';
import { trimObj } from '../utils';

@Injectable()
export class SchedulingService {
  constructor(
    @InjectModel(Scheduling)
    private readonly schedulingModel: typeof Scheduling,
    private schedulingTypesService: SchedulingTypesService
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
        throw new HttpException('Há campos em branco', 400);
      case !isValid(searchDate):
        throw new HttpException('Data inválida', 400);
      case isBefore(startOfDay(searchDate), startOfToday()):
        throw new HttpException('Você não pode agendar com uma data passada', 400);
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
        limitHour: format(subHours(value, 1), "HH:mm:ss")
      };
    });

    return available;
  }

  async post(userId: number, data: TCreateScheduling) {
    trimObj(data);

    const date = parseISO(data.date);

    try {
      switch (true) {
        case !isValid(date):
          throw new HttpException('Data inválida', 400);
        case isBefore(date, new Date()):
          throw new HttpException('Data passada não permitida', 400);
        default:
          break;
      }

      await this.schedulingTypesService.getById(data.schedulingTypesId);

      const available = await this.schedulingModel.findOne({
        where: {
          schedulingTypesId: data.schedulingTypesId,
          date: startOfHour(date),
          canceledAt: null
        }
      });

      if (available) throw new HttpException('Data de agendamento indisponível', 400);

      return await this.schedulingModel.create({
        ...data,
        userId
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async put(id: number, data: object) { }

  async cancelSchedule(userId: number, id: number) {
    try {
      const scheduling = await this.schedulingModel.findOne({
        where: {
          userId,
          id,
          canceledAt: null
        }
      });

      const dateWithSub = subHours(scheduling.date, 2);

      if (isBefore(dateWithSub, new Date())) throw new HttpException('Você só pode cancelar um agendamento com duas horas de antecedência', 400);

      await scheduling.update({
        canceledAt: new Date()
      });
    } catch (error) {
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