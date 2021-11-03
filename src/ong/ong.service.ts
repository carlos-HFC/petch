import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op as $ } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { TFilterOng, TCreateOng, TUpdateOng } from './ong.dto';
import { Ong } from './ong.model';
import { UploadService } from '../config/upload.service';
import { capitalizeFirstLetter, convertBool, trimObj } from '../utils';

@Injectable()
export class OngService {
  constructor(
    @InjectModel(Ong)
    private readonly ongModel: typeof Ong,
    private uploadService: UploadService,
    private sequelize: Sequelize
  ) { }

  async createOngs() {
    const transaction = await this.sequelize.transaction();

    try {
      await this.ongModel.bulkCreate([
        {
          id: 1,
          name: 'Dogs do Coração',
          email: 'doguineos@dogscore.com',
          image: 'https://images.unsplash.com/photo-1612536057832-2ff7ead58194?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZG9nJTIwaGVhcnR8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          phone1: '1128169333',
          phone2: '11985856127',
          cep: '05850245',
          address: 'Rua Francisco Soares de Farias, 939',
          district: 'Parque Santo Antônio',
          city: 'São Paulo',
          uf: 'SP',
          coverage: 'SP, RJ, MG, ES',
          responsible: 'Raimunda Renata Brito'
        },
        {
          id: 2,
          name: 'Pet Place',
          email: 'place@petplace.com.br',
          image: 'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGV0JTIwcGxhY3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          phone1: '4829542922',
          phone2: '48995972859',
          cep: '88106692',
          address: 'Rua Salvador Silva Porto, 838',
          district: 'Forquilhinha',
          city: 'São José',
          uf: 'SC',
          coverage: 'SC, PR, SP',
          responsible: 'Jaqueline Aparecida Pereira'
        },
        {
          id: 3,
          name: 'ONG Melhor Amigo',
          email: 'OMA@melhoramigo.com.br',
          image: 'https://images.unsplash.com/photo-1607163365613-c281acde5012?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGV0JTIwZnJpZW5kfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          phone1: '8827492520',
          phone2: '88994753142',
          phone3: '8825555591',
          cep: '62030705',
          address: 'Rua Pricesa do Norte, 904',
          district: 'Cidade Pedro Mendes Carneiro',
          city: 'Sobral',
          uf: 'CE',
          coverage: 'CE, PE',
          responsible: 'Francisco Davi Diogo de Paula'
        },
      ], { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async petsByOng() {
    return await this.ongModel.scope('petsByOng').findAll();
  }

  async get(query?: TFilterOng) {
    trimObj(query);
    const where = {};

    if (query.name) Object.assign(where, { name: { [$.startsWith]: query.name.normalize().toLowerCase() } });
    if (query.uf) Object.assign(where, { uf: query.uf.toUpperCase() });

    // if (query.coverage) {
    //   const ongs = await this.ongModel.findAll({
    //     paranoid: !convertBool(query.inactives),
    //     where,
    //     attributes: ['id', 'name', 'email', 'phone1', 'responsible', 'cep', 'city', 'deletedAt']
    //   });

    //   const states = query.coverage.toUpperCase().split(',').map(cov => cov.trim());

    //   const ongsFiltered = states.flatMap(state => ongs.filter(ong => ong.coverage.includes(state)));

    //   return [...new Map(ongsFiltered.map(ong => [ong['id'], ong])).values()].sort((a, b) => a.id < b.id ? - 1 : 1);
    // }

    return await this.ongModel.findAll({
      paranoid: !convertBool(query.inactives),
      where,
      attributes: ['id', 'name', 'email', 'phone1', 'responsible', 'image', 'cep', 'city', 'deletedAt']
    });
  }

  async findById(id: number, inactives?: 'true' | 'false') {
    const ong = await this.ongModel.findByPk(id, { paranoid: !convertBool(inactives) });

    if (!ong) throw new HttpException('ONG não encontrada', 404);

    return ong;
  }

  async findByName(name: string) {
    return await this.ongModel.findOne({
      where: {
        name: capitalizeFirstLetter(name).trim()
      }
    });
  }

  async findByEmail(email: string) {
    return await this.ongModel.findOne({
      where: {
        email: email.toLowerCase()
      }
    });
  }

  async post(data: TCreateOng, media?: Express.MulterS3.File) {
    trimObj(data);

    if (await this.findByEmail(data.email) || await this.findByName(data.name)) throw new HttpException('ONG já cadastrada', 400);

    if (media) {
      const image = (await this.uploadService.uploadFile(media)).url;
      Object.assign(data, { image });
    }

    const transaction = await this.sequelize.transaction();

    try {
      await this.ongModel.create({ ...data }, { transaction });

      await transaction.commit();

      return { message: 'ONG cadastrada com sucesso', background: 'success' };
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async put(id: number, data: TUpdateOng, media?: Express.MulterS3.File) {
    trimObj(data);

    const ong = await this.findById(id);

    if (data.email && data.email !== ong.email) {
      if (await this.findByEmail(data.email)) throw new HttpException('ONG já cadastrada', 400);
    }

    if (data.name && data.name !== ong.name) {
      if (await this.findByName(data.name)) throw new HttpException('ONG já cadastrada', 400);
    }

    if (media) {
      const image = (await this.uploadService.uploadFile(media)).url;
      Object.assign(data, { image });
    }

    const transaction = await this.sequelize.transaction();

    try {
      await ong.update({ ...data }, { transaction });

      await transaction.commit();

      return { message: 'ONG editada com sucesso', background: 'success' };
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async activeInactive(id: number, status: 'true' | 'false') {
    const st = convertBool(status);

    const ong = await this.findById(id, 'true');

    if (!st) return await ong.destroy();
    return await ong.restore();
  }
}