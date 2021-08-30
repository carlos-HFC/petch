import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op as $ } from 'sequelize';

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

  async get(query?: TFilterPartner) {
    trimObj(query);
    const where = {};

    if (query.fantasyName) Object.assign(where, { fantasyName: { [$.startsWith]: query.fantasyName.normalize().toLowerCase() } });
    if (query.uf) Object.assign(where, { uf: query.uf.toUpperCase() });

    return await this.partnerModel.findAll({
      paranoid: !query.inactives,
      where,
      attributes: ['id', 'fantasyName', 'cnpj', 'email', 'phone1', 'responsible', 'deletedAt']
    });
  }

  async findById(id: number, inactives?: boolean) {
    const partner = await this.partnerModel.findByPk(id, { paranoid: !inactives });

    if (!partner) throw new HttpException('ONG não encontrada', 404);

    return partner;
  }

  async findByEmail(email: string) {
    validateEmail(email);
    return await this.partnerModel.findOne({
      where: {
        email: email.toLowerCase()
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

    try {
      if (data.cep) validateCEP(data.cep);
      if (data.phone1) validatePhone(data.phone1);
      if (data.phone2) validatePhone(data.phone2);
      if (data.phone3) validatePhone(data.phone3);

      if (await this.findByEmail(data.email) || await this.findByCNPJ(data.cnpj) || await this.findByStateRegistration(data.stateRegistration)) throw new HttpException('Parceiro já cadastrado', 400);

      if (media) {
        const image = (await this.uploadService.uploadFile(media)).url;
        Object.assign(data, { image });
      }

      const partner = await this.partnerModel.create({ ...data });

      return partner;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async put(id: number, data: TUpdatePartner, media?: Express.MulterS3.File) {
    trimObj(data);

    try {
      if (data.cep) validateCEP(data.cep);
      if (data.phone1) validatePhone(data.phone1);
      if (data.phone2) validatePhone(data.phone2);
      if (data.phone3) validatePhone(data.phone3);

      const partner = await this.findById(id);

      if (data.email && data.email !== partner.email) {
        if (await this.findByEmail(data.email)) throw new HttpException('Parceiro já cadastrado', 400);
      }

      if (data.cnpj && data.cnpj !== partner.cnpj) {
        if (await this.findByCNPJ(data.cnpj)) throw new HttpException('Parceiro já cadastrado', 400);
      }

      if (data.stateRegistration && data.stateRegistration !== partner.stateRegistration) {
        if (await this.findByStateRegistration(data.stateRegistration)) throw new HttpException('Parceiro já cadastrado', 400);
      }

      if (media) {
        const image = (await this.uploadService.uploadFile(media)).url;
        Object.assign(data, { image });
      }

      await partner.update({ ...data });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async delete(id: number) {
    const partner = await this.findById(id);

    await partner.destroy();
  }

  async restore(id: number) {
    const partner = await this.findById(id, true);

    await partner.restore();
  }
}