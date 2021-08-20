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
    return await this.petModel.findAll();
  }

  async findById(id: number) {
    const num = (/([\d]{0,})([\.{1}])?([\d]+)/g);

    const pet = await this.petModel.findByPk(id);

    if (!pet) throw new HttpException('Pet não encontrado', 404);

    const size = await this.sizeService.findBySize(pet.speciesId, Number(pet.weight.match(num).join('')));

    return { ...pet.toJSON(), size };
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

  async put(id: number, data: object) {
    trimObj(data);

    try {
      const pet = await this.findById(id);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async delete() { }
}