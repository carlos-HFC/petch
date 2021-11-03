import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op as $ } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { TCreatePartner, TFilterPartner, TUpdatePartner } from './partner.dto';
import { Partner } from './partner.model';
import { UploadService } from '../config/upload.service';
import { convertBool, trimObj, validateCNPJ } from '../utils';

@Injectable()
export class PartnerService {
  constructor(
    @InjectModel(Partner)
    private readonly partnerModel: typeof Partner,
    private sequelize: Sequelize,
    private uploadService: UploadService
  ) { }

  async createPartners() {
    await this.partnerModel.bulkCreate([
      {
        id: 1,
        fantasyName: 'Petz',
        companyName: 'Petz Com. e Ind. de Produtos LTDA.',
        cnpj: '05875578000105',
        stateRegistration: '987178808780',
        responsible: 'João Osvaldo Lima',
        email: 'financeiro@petzltda.com.br',
        website: 'https://petz.com.br',
        phone1: '1138376789',
        phone2: '11988525083',
        cep: '04298090',
        address: 'Rua Bertolina Maria, 561',
        district: 'Vila Vermelha',
        city: 'São Paulo',
        uf: 'SP',
        image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1150&q=80'
      },
      {
        id: 2,
        fantasyName: 'Photografia Sublime',
        companyName: 'Photografia Sublime ME',
        cnpj: '69334805000178',
        stateRegistration: '752415244087',
        responsible: 'Eliane Fátima Cavalcanti',
        email: 'photo@sublime.com.br',
        website: 'https://photografiasublime.com.br',
        phone1: '1728728306',
        phone2: '17997510090',
        phone3: '17997519955',
        cep: '15810476',
        address: 'Rua Caldas Novas, 885',
        district: 'Loteamento Cidade Jardim',
        city: 'Catanduva',
        uf: 'SP',
        image: 'https://images.unsplash.com/photo-1484239398315-f1681ef72fe6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80'
      },
      {
        id: 3,
        fantasyName: 'Focinhos e Patas',
        companyName: 'Focinhos e Patas Com. de Produtos LTDA.',
        cnpj: '74010830000136',
        stateRegistration: '175559121958',
        responsible: 'Jorge Kaique das Neves',
        email: 'vendas@focinhospatas.com.br',
        website: 'https://focinhospatas.com.br',
        phone1: '1138224867',
        cep: '05568010',
        address: 'Rua Severiano Leite da Silva, 233',
        district: 'Jardim São Jorge',
        complement: '15 andar',
        city: 'São Paulo',
        uf: 'SP',
        image: 'https://images.unsplash.com/photo-1606425271394-c3ca9aa1fc06?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGF3fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        id: 4,
        fantasyName: 'PetPlace',
        companyName: 'PetPlace Produtos Licenciados LTDA.',
        cnpj: '25759326000128',
        stateRegistration: '635503786',
        responsible: 'Francisco Gael das Neves',
        email: 'comunicacoes@petplace.com.br',
        website: 'https://petplace.com.br',
        phone1: '4829027084',
        phone2: '48982086019',
        cep: '88706-203',
        address: 'Rua Santilino Antônio de Medeiros, 768',
        district: 'Passo do Gado',
        city: 'Tubarão',
        uf: 'SC',
        image: 'https://images.unsplash.com/photo-1494947665470-20322015e3a8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8ZG9nc3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
    ])
  }

  async get(query?: TFilterPartner) {
    trimObj(query);
    const where = {};

    if (query.fantasyName) Object.assign(where, { fantasyName: { [$.startsWith]: query.fantasyName.normalize().toLowerCase() } });
    if (query.uf) Object.assign(where, { uf: query.uf.toUpperCase() });

    return await this.partnerModel.findAll({
      paranoid: !convertBool(query.inactives),
      where,
      attributes: ['id', 'fantasyName', 'cnpj', 'email', 'phone1', 'responsible', 'image', 'deletedAt']
    });
  }

  async findById(id: number, inactives?: 'true' | 'false') {
    const partner = await this.partnerModel.findByPk(id, { paranoid: !convertBool(inactives) });

    if (!partner) throw new HttpException('Parceiro não encontrado', 404);

    return partner;
  }

  async findByEmail(email: string) {
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

  async post(data: TCreatePartner, media?: Express.MulterS3.File) {
    trimObj(data);

    if (await this.findByEmail(data.email) || await this.findByCNPJ(data.cnpj)) throw new HttpException('Parceiro já cadastrado', 400);

    if (media) {
      const image = (await this.uploadService.uploadFile(media)).url;
      Object.assign(data, { image });
    }

    const transaction = await this.sequelize.transaction();

    try {
      await this.partnerModel.create({ ...data }, { transaction });

      await transaction.commit();

      return { message: 'Parceiro cadastrado com sucesso', background: 'success' };
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async put(id: number, data: TUpdatePartner, media?: Express.MulterS3.File) {
    trimObj(data);

    const partner = await this.findById(id);

    if (data.email && data.email !== partner.email) {
      if (await this.findByEmail(data.email)) throw new HttpException('Parceiro já cadastrado', 400);
    }

    if (data.cnpj && data.cnpj !== partner.cnpj) {
      if (await this.findByCNPJ(data.cnpj)) throw new HttpException('Parceiro já cadastrado', 400);
    }

    if (media) {
      const image = (await this.uploadService.uploadFile(media)).url;
      Object.assign(data, { image });
    }

    const transaction = await this.sequelize.transaction();

    try {
      await partner.update({ ...data }, { transaction });

      await transaction.commit();

      return { message: 'Parceiro editado com sucesso', background: 'success' };
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async activeInactive(id: number, status: 'true' | 'false') {
    const st = convertBool(status);

    const partner = await this.findById(id, 'true');

    if (!st) return await partner.destroy();
    return await partner.restore();
  }
}