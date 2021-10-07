import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { col, FindOptions, Op as $, where } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { TCreatePet, TFilterPet, TUpdatePet } from './pet.dto';
import { Pet } from './pet.model';
import { UploadService } from '../config/upload.service';
import { DislikeService } from '../dislike/dislike.service';
import { FavoriteService } from '../favorite/favorite.service';
import { GiftService } from '../gift/gift.service';
import { OngService } from '../ong/ong.service';
import { SpeciesService } from '../species/species.service';
import { User } from '../user/user.model';
import { convertBool, trimObj } from '../utils';

@Injectable()
export class PetService {
  constructor(
    @InjectModel(Pet)
    private readonly petModel: typeof Pet,
    private ongService: OngService,
    private speciesService: SpeciesService,
    private uploadService: UploadService,
    private sequelize: Sequelize,
    private dislikeService: DislikeService,
    private favoriteService: FavoriteService,
    private giftService: GiftService,
  ) { }

  async petsByGender(options?: FindOptions) {
    return await this.petModel.findAll({ where: { userId: null }, attributes: ['id', 'gender'] });
  }

  async find(id: number, query?: TFilterPet) {
    trimObj(query);
    const dislikes = await this.dislikeService.get({
      where: {
        userId: id,
        id: { [$.ne]: null }
      },
      attributes: ['petId']
    });

    const dislikesPetIds = dislikes.map(dislike => dislike.petId);

    const options = {
      userId: null,
      id: { [$.notIn]: dislikesPetIds }
    };

    if (query.age) Object.assign(options, { age: { [$.startsWith]: query.age } });
    if (query.weight) Object.assign(options, { weight: { [$.startsWith]: query.weight } });
    if (query.cut) Object.assign(options, { cut: convertBool(query.cut) });
    if (query.gender) Object.assign(options, { gender: query.gender });
    if (query.speciesId) Object.assign(options, { speciesId: query.speciesId });
    if (query.uf) Object.assign(options, { ong: where(col('ong.coverage'), { [$.substring]: query.uf.toUpperCase() }) });

    return await this.petModel.scope('findToAdopt').findAll({
      where: options,
      order: this.sequelize.random()
    });
  }

  async get(query?: TFilterPet) {
    trimObj(query);

    return await this.petModel.findAll({
      paranoid: !convertBool(query.inactives),
      attributes: ['id', 'name', 'image', 'gender', 'age', 'deletedAt'],
      order: [['id', 'asc']],
    });
  }

  async findById(id: number, inactives?: 'true' | 'false') {
    const pet = await this.petModel.findOne({
      where: {
        id,
        userId: null,
      },
      paranoid: !convertBool(inactives)
    });

    if (!pet) throw new HttpException('Pet não encontrado', 404);

    return pet;
  }

  async findPetToFavorite(id: number, userId: number) {
    const dislikes = await this.dislikeService.get({
      where: {
        userId,
        id: { [$.ne]: null }
      },
      attributes: ['petId']
    });

    const dislikesPetIds = dislikes.map(d => d.petId);

    const pet = await this.petModel.findOne({
      where: {
        userId: null,
        [$.and]: [
          { id: { [$.notIn]: dislikesPetIds } },
          { id },
        ]
      }
    });

    if (!pet) throw new HttpException('Pet não encontrado', 404);

    return pet;
  }

  async findMyFavorites(userId: number) {
    const favorites = await this.favoriteService.get({
      where: { userId },
      attributes: ['petId']
    });

    const favoritesPetIds = favorites.map(favorite => favorite.petId);

    const pets = await this.petModel.scope('findToAdopt').findAll({
      where: {
        id: { [$.in]: favoritesPetIds }
      }
    });

    return pets;
  }

  async create(data: TCreatePet, media: Express.MulterS3.File) {
    trimObj(data);

    const num = (/([\d])/g);

    await this.ongService.findById(data.ongId);
    await this.speciesService.findById(data.speciesId);

    const transaction = await this.sequelize.transaction();

    try {
      if (!media) throw new HttpException('Imagem é obrigatória', 400);

      const image = (await this.uploadService.uploadFile(media)).url;
      Object.assign(data, { image });

      const age = Number(data.age.match(num)?.join(''));
      if (isNaN(age)) throw new HttpException('Idade inválida', 400);

      const pet = await this.petModel.create({ ...data }, { transaction });

      await transaction.commit();

      return pet;
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async put(id: number, data: TUpdatePet, media: Express.MulterS3.File) {
    trimObj(data);

    const num = (/([\d])/g);

    const pet = await this.findById(id);

    if (data.ongId) await this.ongService.findById(data.ongId);
    if (data.speciesId) await this.speciesService.findById(data.speciesId);

    const transaction = await this.sequelize.transaction();
    try {

      if (data.age) {
        const age = Number(data.age.match(num)?.join(''));
        if (isNaN(age)) throw new HttpException('Idade inválida', 400);
      }

      if (media) {
        const image = (await this.uploadService.uploadFile(media)).url;
        Object.assign(data, { image });
      }

      await pet.update({ ...data }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async adopt(user: User, petId: number) {
    const pet = await this.petModel.findOne({
      where: {
        id: petId,
        userId: null
      }
    });

    if (!pet) throw new HttpException('Pet não encontrado', 404);

    const transaction = await this.sequelize.transaction();

    try {
      const favorites = await this.favoriteService.get({ where: { petId } });

      await pet.update({ userId: user.id, adoptedAt: new Date() }, { transaction });

      await Promise.all(favorites.map(favorite => favorite.destroy({ force: true, transaction })));

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async chooseGift(user: User, petId: number, giftId: number) {
    const pet = await this.petModel.findOne({
      where: {
        id: petId,
        userId: user.id
      }
    });

    if (!pet) throw new HttpException('Pet não encontrado', 404);

    await this.giftService.findById(giftId);

    const transaction = await this.sequelize.transaction();

    try {
      await pet.update({ giftId }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async activeInactive(id: number, status: 'true' | 'false') {
    const st = convertBool(status);

    const pet = await this.findById(id, 'true');

    if (!st) return await pet.destroy();
    return await pet.restore();
  }
}