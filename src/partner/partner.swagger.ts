import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';

export class Partner {
  @ApiProperty({ uniqueItems: true, type: 'integer', readOnly: true })
  id: number;

  @ApiProperty({ type: 'string' })
  fantasyName: string;

  @ApiProperty({ type: 'string' })
  companyName: string;

  @ApiProperty({ type: 'string', uniqueItems: true })
  cnpj: string;

  @ApiProperty({ type: 'string', uniqueItems: true })
  stateRegistration: string;

  @ApiProperty({ type: 'string' })
  responsible: string;

  @ApiProperty({ type: 'string', uniqueItems: true })
  email: string;

  @ApiProperty({ type: 'string' })
  website: string;

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

  @ApiProperty({ type: 'string', required: false })
  image: string;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  deletedAt: Date | null;
}

export class IndexPartner extends PickType(Partner, ['id', 'fantasyName', 'cnpj', 'email', 'phone1', 'responsible', 'deletedAt']) { }

export class CreatePartner extends OmitType(Partner, ['createdAt', 'updatedAt', 'deletedAt', 'id', 'image']) {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  media: string;
}

export class UpdatePartner extends PartialType(CreatePartner) { }

export class FilterPartner {
  @ApiProperty({ type: 'boolean', required: false })
  inactives?: boolean;

  @ApiProperty({ type: 'string', required: false })
  fantasyName?: string;

  @ApiProperty({ type: 'string', required: false })
  uf?: string;
}