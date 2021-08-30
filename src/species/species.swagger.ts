import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateSize, Size } from '../size/size.swagger';

export class Species {
  @ApiProperty({ type: 'integer', uniqueItems: true, readOnly: true })
  id: number;

  @ApiProperty({ type: 'string', uniqueItems: true })
  name: string;

  @ApiProperty({ type: 'string', required: false })
  image: string;

  @ApiProperty({ type: [Size], required: false })
  sizes: Size[];

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  deletedAt: Date | null;
}

export class IndexSpecies extends OmitType(Species, ['createdAt', 'updatedAt', 'image']) { }

export class CreateSpecies extends OmitType(Species, ['id', 'image', 'sizes', 'createdAt', 'updatedAt', 'deletedAt']) {
  @ApiProperty({ type: [CreateSize] })
  size: CreateSize[];

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  media: string;
}

export class UpdateSpecies extends PartialType(OmitType(Species, ['id', 'image', 'sizes', 'createdAt', 'updatedAt', 'deletedAt'])) {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  media: string;
}

export class FilterSpecies {
  @ApiProperty({ type: 'boolean', required: false })
  inactives: boolean;

  @ApiProperty({ type: 'string', required: false })
  name: string;
}