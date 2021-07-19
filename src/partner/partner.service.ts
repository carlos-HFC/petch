import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Partner } from './partner.model';
import { UploadService } from '../upload.service';
import { trimObj, validateCEP, validateCNPJ, validateEmail, validatePhone } from '../utils';

@Injectable()
export class PartnerService {
  constructor(
    @InjectModel(Partner)
    private readonly partnerModel: typeof Partner,
    private uploadService: UploadService
  ) { }

  async get() {
    return await this.partnerModel.findAll();
  }

  async findById(id: number) {
    const partner = await this.partnerModel.findByPk(id);

    if (!partner) throw new HttpException('ONG não encontrada', 404);

    return partner;
  }

  async findByEmail(email: string) {
    validateEmail(email);

    return await this.partnerModel.findOne({
      where: {
        email: email.trim().toLowerCase()
      }
    });
  }

  async findByCNPJ(cnpj: string) {
    validateCNPJ(cnpj);

    return await this.partnerModel.findOne({
      where: {
        cnpj: cnpj.replace(/[\/\s.-]/g, '')
      }
    });
  }

  async findByStateRegistration(stateRegistration: string) {
    return await this.partnerModel.findOne({
      where: {
        stateRegistration: stateRegistration.replace(/[\s.]/g, '')
      }
    });
  }

  async post(data: TCreatePartner, media?: Express.MulterS3.File) {
    trimObj(data);
    validateCEP(data.cep);
    validatePhone(data.phone1);
    validatePhone(data?.phone2);
    validatePhone(data?.phone3);

    if (await this.findByEmail(data.email) || await this.findByCNPJ(data.cnpj) || await this.findByStateRegistration(data.stateRegistration)) throw new HttpException('Parceiro já cadastrado', 400);

    const file = media ? await this.uploadService.uploadFile(media) : null;

    const partner = await this.partnerModel.create({
      ...data,
      logo: file && file.url
    });

    return partner;
  }

  async put(data: TUpdatePartner) { }

  async delete(id: number) {
    const partner = await this.findById(id);

    await partner.destroy();
  }
}