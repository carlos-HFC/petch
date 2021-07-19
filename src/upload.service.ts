import { HttpException, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class UploadService {
  s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  async uploadFile(file: Express.MulterS3.File) {
    if (!file.mimetype.includes('image')) throw new HttpException('Arquivo não suportado', 400);

    const upload = await this.s3.upload({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${Date.now()}__${file.originalname}`,
      Body: file.buffer,
      ACL: 'public-read'
    }).promise();

    return { url: upload.Location };
  }
}