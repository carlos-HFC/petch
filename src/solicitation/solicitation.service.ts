import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Solicitation } from './solicitation.model';
import { SolicitationTypesService } from '../solicitationTypes/solicitationTypes.service';
import { UploadService } from '../upload.service';
import { User } from '../user/user.model';
import { trimObj, validateEmail } from '../utils';

@Injectable()
export class SolicitationService {
  constructor(
    @InjectModel(Solicitation)
    private readonly solicitationModel: typeof Solicitation,
    private solicitationTypeService: SolicitationTypesService,
    private uploadService: UploadService
  ) { }

  async get() {
    return await this.solicitationModel.findAll();
  }

  async findById(id: number) {
    const solicitation = await this.solicitationModel.findByPk(id);

    if (!solicitation) throw new HttpException('Solicitação não encontrada', 404);

    return solicitation;
  }

  async post(data: TCreateSolicitation, media?: Express.MulterS3.File, user?: User) {
    trimObj(data);

    try {
      await this.solicitationTypeService.findById(data.solicitationTypeId);

      if (media) {
        const image = (await this.uploadService.uploadFile(media)).url;
        Object.assign(data, { image });
      }

      if (user) {
        if (data.name) data.name = null;
        if (data.email) data.email = null;

        const solicitation = await this.solicitationModel.create({
          ...data,
          userId: user.id
        });

        return solicitation;
      }

      if (!data.email) throw new HttpException('E-mail é obrigatório', 400);
      validateEmail(data.email);

      const solicitation = await this.solicitationModel.create({ ...data });

      return solicitation;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async put(data: object) { }

  async delete(id: number) {
    const solicitation = await this.findById(id);

    await solicitation.destroy();
  }
}