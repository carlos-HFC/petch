import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';

import { Ong } from '../ong/ong.swagger';
import { Species } from '../species/species.swagger';

export class Pet {
  @ApiProperty({ type: 'integer', uniqueItems: true, readOnly: true })
  id: string;

  @ApiProperty({ type: 'string', required: false })
  breed: string;

  @ApiProperty({ type: 'string', required: false })
  name: string;

  @ApiProperty({ type: 'string' })
  age: string;

  @ApiProperty({ type: 'string' })
  color: string;

  @ApiProperty({ type: 'string' })
  description: string;

  @ApiProperty({ type: 'string' })
  weight: string;

  @ApiProperty({ type: 'string', enum: ['M', 'F'] })
  gender: string;

  @ApiProperty({ type: 'string' })
  photos: string;

  @ApiProperty({ type: 'boolean', required: false, default: false })
  cut: boolean;

  @ApiProperty({ type: 'number' })
  ongId: number;

  @ApiProperty({ type: 'number' })
  speciesId: number;

  @ApiProperty({ type: Ong, required: false })
  ong: Ong;

  @ApiProperty({ type: Species, required: false })
  species: Species;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  deletedAt: Date | null;
}

export class IndexPet extends PickType(Pet, ['id', 'name', 'age', 'gender', 'weight', 'deletedAt']) {
  @ApiProperty({
    type: 'object',
    properties: {
      name: { type: 'string' }
    }
  })
  ong: object;

  @ApiProperty({
    type: 'object',
    properties: {
      name: { type: 'string' }
    }
  })
  species: object;
}

export class CreatePet extends OmitType(Pet, ['id', 'createdAt', 'updatedAt', 'deletedAt', 'ong', 'species', 'photos']) {
  @ApiProperty({ type: ['string'], format: 'binary' })
  images: string[];
}

export class UpdatePet extends CreatePet { }

export class FilterPet {
  @ApiProperty({ type: 'boolean', required: false })
  inactives?: boolean;

  @ApiProperty({ type: 'string', enum: ['M', 'F'], required: false })
  gender?: string;

  @ApiProperty({ type: 'string', required: false })
  ong?: string;

  @ApiProperty({ type: 'string', required: false })
  species?: string;
}