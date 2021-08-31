import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Scheduling } from './scheduling.model';

@Injectable()
export class SchedulingService {
  constructor(
    @InjectModel(Scheduling)
    private readonly schedulingModel: typeof Scheduling
  ) { }

  async get(query?: object) {
    return await this.schedulingModel.findAll();
  }

  async findById(id: number, inactives?: boolean) {
    const scheduling = await this.schedulingModel.findByPk(id, { paranoid: !inactives });

    if (!scheduling) throw new HttpException('Agendamento não encontrado', 404);

    return scheduling;
  }

  async post(data: TCreateScheduling) { }

  async put(id: number, data: object) { }

  async delete(id: number) {
    const scheduling = await this.findById(id);

    await scheduling.destroy();
  }

  async restore(id: number) {
    const scheduling = await this.findById(id, true);

    await scheduling.restore();
  }
}