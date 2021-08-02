import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

export class Species {
  @ApiProperty({ type: 'integer', uniqueItems: true, readOnly: true })
  id: number;

  @ApiProperty({ type: 'string', uniqueItems: true })
  name: string;

  @ApiProperty({ type: 'string', required: false })
  avatar: string;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  deletedAt: Date | null;
}

export class CreateSpecies extends OmitType(Species, ['id', 'avatar', 'createdAt', 'updatedAt', 'deletedAt']) {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  media: string;
}

export class UpdateSpecies extends PartialType(CreateSpecies) { }

export class FilterSpecies {
  @ApiProperty({ type: 'boolean', required: false })
  inactives: boolean;

  @ApiProperty({ type: 'string', required: false })
  name: string;
}