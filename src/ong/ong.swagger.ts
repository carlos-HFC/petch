import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

export class Ong {
  @ApiProperty({ type: 'integer', uniqueItems: true, readOnly: true })
  id: string;

  @ApiProperty({ type: 'string', uniqueItems: true })
  name: string;

  @ApiProperty({ type: 'string', uniqueItems: true })
  email: string;

  @ApiProperty({ type: 'string', required: false })
  logo: string;

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
  actingStates: string;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  deletedAt: Date | null;
}

export class CreateOng extends OmitType(Ong, ['createdAt', 'updatedAt', 'deletedAt', 'id', 'logo']) {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  media: string;
}

export class UpdateOng extends PartialType(CreateOng) { }