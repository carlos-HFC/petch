import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

export class Gift {
  @ApiProperty({ uniqueItems: true, type: 'integer', readOnly: true })
  id: number;

  @ApiProperty({ type: 'string' })
  name: string;

  @ApiProperty({ type: 'string' })
  description: string;

  @ApiProperty({ type: 'string', required: false })
  size: string;

  @ApiProperty({ type: 'string', required: false })
  color: string;

  @ApiProperty({ type: 'string', required: false })
  weight: string;

  @ApiProperty({ type: 'string', required: false })
  taste: string;

  @ApiProperty({ type: 'string', required: false })
  media: string;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  deletedAt: Date | null;
}

export class CreateGift extends OmitType(Gift, ['createdAt', 'updatedAt', 'deletedAt', 'id']) { }

export class UpdateGift extends PartialType(CreateGift) { }