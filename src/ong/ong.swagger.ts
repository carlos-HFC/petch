import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';

export class Ong {
  @ApiProperty({ type: 'integer', uniqueItems: true, readOnly: true })
  id: string;

  @ApiProperty({ type: 'string', uniqueItems: true })
  name: string;

  @ApiProperty({ type: 'string', uniqueItems: true })
  email: string;

  @ApiProperty({ type: 'string' })
  responsible: string;

  @ApiProperty({ type: 'string', required: false })
  image: string;

  @ApiProperty({ type: 'string' })
  phone1: string;

  @ApiProperty({ type: 'string', required: false })
  phone2: string;

  @ApiProperty({ type: 'string', required: false })
  phone3: string;

  @ApiProperty({ type: 'string' })
  cep: string;

  @ApiProperty({ type: 'string' })
  address: string;

  @ApiProperty({ type: 'string' })
  district: string;

  @ApiProperty({ type: 'string', required: false })
  complement: string;

  @ApiProperty({ type: 'string' })
  city: string;

  @ApiProperty({ type: 'string' })
  uf: string;

  @ApiProperty({ type: 'string' })
  coverage: string;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  deletedAt: Date | null;
}

export class IndexOng extends PickType(Ong, ['id', 'name', 'email', 'phone1', 'responsible', 'city', 'uf', 'deletedAt']) { }

export class CreateOng extends OmitType(Ong, ['createdAt', 'updatedAt', 'deletedAt', 'id', 'image']) {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  media: string;
}

export class UpdateOng extends PartialType(CreateOng) { }

export class FilterOng {
  @ApiProperty({ type: 'string', required: false })
  name?: string;

  @ApiProperty({ type: 'string', required: false })
  uf?: string;

  @ApiProperty({ type: 'string', required: false })
  coverage?: string;

  @ApiProperty({ type: 'boolean', required: false })
  inactives?: boolean;
}