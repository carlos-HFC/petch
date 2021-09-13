import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

import { Partner } from '../partner/partner.swagger';

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
  image: string;

  @ApiProperty({ type: 'number', required: false })
  partnerId: number;

  @ApiProperty({ type: Partner, required: false })
  partner: Partner;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  deletedAt: Date | null;
}

export class IndexGift extends OmitType(Gift, ['createdAt', 'updatedAt', 'image', 'partner']) {
  @ApiProperty({
    type: 'object',
    properties: {
      fantasyName: {
        type: 'string'
      }
    }
  })
  partner: object;
}

export class CreateGift extends OmitType(Gift, ['createdAt', 'updatedAt', 'deletedAt', 'id', 'image', 'partner']) {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  media: string;
}

export class UpdateGift extends PartialType(CreateGift) { }

export class FilterGift {
  @ApiProperty({ type: 'boolean', required: false })
  inactives: boolean;

  @ApiProperty({ type: 'string', required: false })
  name: string;
}