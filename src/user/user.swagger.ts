import { ApiProperty } from '@nestjs/swagger';

export class CreateUser {
  @ApiProperty({ type: 'boolean', required: false, default: false })
  isAdmin: boolean;

  @ApiProperty({ type: 'string' })
  name: string;

  @ApiProperty({ type: 'string', uniqueItems: true })
  email: string;

  @ApiProperty({ type: 'string' })
  password: string;

  @ApiProperty({ type: 'string' })
  confirmPassword: string;

  @ApiProperty({ type: 'string', uniqueItems: true })
  cpf: string;

  @ApiProperty({ type: 'string' })
  birthday: string;

  @ApiProperty({ type: 'string', enum: ['M', 'F', 'O'] })
  gender: string;

  @ApiProperty({ type: 'string' })
  cep: string;

  @ApiProperty({ type: 'string' })
  address: string;

  @ApiProperty({ type: 'string' })
  district: string;

  @ApiProperty({ type: 'string' })
  city: string;

  @ApiProperty({ type: 'string' })
  uf: string;

  @ApiProperty({ type: 'string' })
  phone: string;

  @ApiProperty({ type: 'string', required: false })
  complement: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  media: string;
}