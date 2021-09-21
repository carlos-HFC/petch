import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsPostalCode, IsString, IsUrl, ValidateIf } from 'class-validator';

export class Partner {
  @ApiProperty({ uniqueItems: true, type: 'integer', readOnly: true })
  id: number;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Nome Fantasia é obrigatório' })
  @IsString()
  fantasyName: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Razão Social é obrigatória' })
  @IsString()
  companyName: string;

  @ApiProperty({ type: 'string', uniqueItems: true })
  @IsNotEmpty({ message: 'CNPJ é obrigatório' })
  @IsString()
  cnpj: string;

  @ApiProperty({ type: 'string', uniqueItems: true })
  @IsNotEmpty({ message: 'Inscrição Estadual é obrigatória' })
  @IsString()
  stateRegistration: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Responsável é obrigatório' })
  @IsString()
  responsible: string;

  @ApiProperty({ type: 'string', uniqueItems: true })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsString()
  email: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Website é obrigatório' })
  @IsUrl({}, { message: 'Website inválido' })
  @IsString()
  website: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @IsPhoneNumber('BR', { message: 'Telefone inválido' })
  @IsString()
  phone1: string;

  @ApiProperty({ type: 'string', required: false })
  @ValidateIf((_, value) => value)
  @IsPhoneNumber('BR', { message: 'Telefone 2 inválido' })
  phone2: string;

  @ApiProperty({ type: 'string', required: false })
  @ValidateIf((_, value) => value)
  @IsPhoneNumber('BR', { message: 'Telefone 3 inválido' })
  phone3: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'CEP é obrigatório' })
  @IsPostalCode('BR', { message: 'CEP inválido' })
  @IsString()
  cep: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Endereço é obrigatório' })
  @IsString()
  address: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Bairro é obrigatório' })
  @IsString()
  district: string;

  @ApiProperty({ type: 'string', required: false })
  complement: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  @IsString()
  city: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'UF é obrigatória' })
  @IsString()
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

export class IndexPartner extends PickType(Partner, ['id', 'fantasyName', 'cnpj', 'email', 'phone1', 'responsible', 'image', 'deletedAt']) { }

export class TCreatePartner extends OmitType(Partner, ['createdAt', 'updatedAt', 'deletedAt', 'id', 'image']) {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  media: string;
}

export class TUpdatePartner extends PartialType(TCreatePartner) { }

export class TFilterPartner {
  @ApiProperty({ type: 'string', enum: ['true', 'false'], required: false })
  inactives?: 'true' | 'false';

  @ApiProperty({ type: 'string', required: false })
  fantasyName?: string;

  @ApiProperty({ type: 'string', required: false })
  uf?: string;
}