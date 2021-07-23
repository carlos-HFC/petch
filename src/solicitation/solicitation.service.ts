import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SolicitationTypesService } from 'src/solicitationTypes/solicitationTypes.service';
import { UploadService } from 'src/upload.service';
import { User } from 'src/user/user.model';
import { trimObj, validateEmail } from 'src/utils';

import { Solicitation } from './solicitation.model';

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

    await this.solicitationTypeService.findById(data.solicitationTypeId);

    if (!data.description) throw new HttpException('Descrição é obrigatória', 400);

    const file = media && await this.uploadService.uploadFile(media);

    if (file) Object.assign(data, { image: file.url });

    if (user) {
      if (data.name) delete data.name;
      if (data.email) delete data.email;

      const solicitation = await this.solicitationModel.create({
        ...data,
        userId: user.id
      });

      return solicitation;
    }

    if (!data.email) throw new HttpException('E-mail é obrigatório', 400);

    validateEmail(data.email);

    return await this.solicitationModel.create({ ...data });
  }

  async put(data: object) { }

  async delete(id: number) {
    const solicitation = await this.findById(id);

    await solicitation.destroy();
  }
}