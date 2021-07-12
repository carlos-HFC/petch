import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Media } from './media.model';
import { UploadService } from '../upload.service';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media)
    private readonly mediaModel: typeof Media,
    private uploadService: UploadService,
  ) { }

  async get() {
    return await this.mediaModel.findAll();
  }

  async post(data: Express.MulterS3.File) {
    const file = await this.uploadService.uploadFile(data);

    const media = await this.mediaModel.create({ ...file });

    return media;
  }
}