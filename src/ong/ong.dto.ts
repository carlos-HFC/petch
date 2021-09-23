import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsPostalCode, IsString, ValidateIf } from 'class-validator';

export class Ong {
  @ApiProperty({ type: 'integer', uniqueItems: true, readOnly: true })
  id: string;

  @ApiProperty({ type: 'string', uniqueItems: true })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @Transform(({ value }) => value.trim())
  @IsString()
  name: string;

  @ApiProperty({ type: 'string', uniqueItems: true })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @Transform(({ value }) => value.trim())
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsString()
  email: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Responsável é obrigatório' })
  @Transform(({ value }) => value.trim())
  @IsString()
  responsible: string;

  @ApiProperty({ type: 'string', required: false })
  image: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @Transform(({ value }) => value.trim())
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
  @Transform(({ value }) => value.trim())
  @IsPostalCode('BR', { message: 'CEP inválido' })
  @IsString()
  cep: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Endereço é obrigatório' })
  @Transform(({ value }) => value.trim())
  @IsString()
  address: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Bairro é obrigatório' })
  @Transform(({ value }) => value.trim())
  @IsString()
  district: string;

  @ApiProperty({ type: 'string', required: false })
  complement: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  @Transform(({ value }) => value.trim())
  @IsString()
  city: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'UF é obrigatória' })
  @Transform(({ value }) => value.trim())
  @IsString()
  uf: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Abrangência é obrigatória' })
  @Transform(({ value }) => value.trim())
  @IsString()
  coverage: string;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  deletedAt: Date | null;
}

export class IndexOng extends PickType(Ong, ['id', 'name', 'email', 'phone1', 'responsible', 'image', 'cep', 'city', 'deletedAt']) { }

export class TCreateOng extends OmitType(Ong, ['createdAt', 'updatedAt', 'deletedAt', 'id', 'image']) {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  media: string;
}

export class TUpdateOng extends PartialType(TCreateOng) { }

export class TFilterOng {
  @ApiProperty({ type: 'string', required: false })
  name?: string;

  @ApiProperty({ type: 'string', required: false })
  uf?: string;

  @ApiProperty({ type: 'string', required: false })
  coverage?: string;

  @ApiProperty({ type: 'string', enum: ['true', 'false'], required: false })
  inactives?: 'true' | 'false';
}