import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Pet } from './pet.model';
import { OngService } from '../ong/ong.service';
import { SizeService } from '../size/size.service';
import { SpeciesService } from '../species/species.service';
import { trimObj } from '../utils';
import { UploadService } from '../upload.service';

@Injectable()
export class PetService {
  constructor(
    @InjectModel(Pet)
    private readonly petModel: typeof Pet,
    private ongService: OngService,
    private speciesService: SpeciesService,
    private sizeService: SizeService,
    private uploadService: UploadService,
  ) { }

  async get() {
    return await this.petModel.findAll({
      attributes: ['id', 'name', 'age', 'gender', 'weight']
    });
  }

  async findById(id: number, inactives?: boolean) {
    const pet = await this.petModel.findByPk(id, { paranoid: !inactives });

    if (!pet) throw new HttpException('Pet não encontrado', 404);

    return pet;
  }

  async post(data: TCreatePet, images?: Express.MulterS3.File[]) {
    trimObj(data);

    try {
      if (data.ongId) await this.ongService.findById(data.ongId);
      if (data.speciesId) await this.speciesService.findById(data.speciesId);

      if (images.length === 0) throw new HttpException('O Pet deve conter, pelo menos, uma foto', 400);

      const photos = (await Promise.all(
        images.map(img => this.uploadService.uploadFile(img))
      )).map(photo => photo.url).toString();

      Object.assign(data, { photos });

      const pet = await this.petModel.create({ ...data });

      return pet;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async put(id: number, data: TUpdatePet) {
    trimObj(data);

    try {
      const pet = await this.findById(id);

      if (data.ongId) await this.ongService.findById(data.ongId);
      if (data.speciesId) await this.speciesService.findById(data.speciesId);

      await pet.update({ ...data });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async delete(id: number) {
    const pet = await this.findById(id);

    await pet.destroy();
  }

  async restore(id: number) {
    const pet = await this.findById(id, true);

    await pet.restore();
  }
}