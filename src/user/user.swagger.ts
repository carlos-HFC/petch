import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

export class User {
  @ApiProperty({ type: 'integer', uniqueItems: true, readOnly: true })
  id: number;

  @ApiProperty({ type: 'string', uniqueItems: true, required: false })
  googleId: string;

  @ApiProperty({ type: 'string' })
  name: string;

  @ApiProperty({ type: 'string', required: false })
  avatar: string;

  @ApiProperty({ type: 'string', uniqueItems: true })
  email: string;

  @ApiProperty({ type: 'boolean', default: false })
  emailVerified: boolean;

  @ApiProperty({ type: 'string', required: false })
  tokenVerificationEmail: string;

  @ApiProperty({ type: 'string', required: false })
  hash: string;

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

  @ApiProperty({ type: 'string', required: false })
  complement: string;

  @ApiProperty({ type: 'string' })
  city: string;

  @ApiProperty({ type: 'string' })
  uf: string;

  @ApiProperty({ type: 'string' })
  phone: string;

  @ApiProperty({ type: 'string', required: false })
  tokenResetPassword: string;

  @ApiProperty({ type: 'string', required: false })
  tokenResetPasswordExpires: string;

  @ApiProperty({ type: 'number' })
  roleId: number;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  deletedAt: Date | null;
}

export class CreateUser extends OmitType(User, ['createdAt', 'updatedAt', 'deletedAt', 'id', 'hash', 'avatar', 'tokenResetPassword', 'tokenResetPasswordExpires', 'tokenVerificationEmail', 'emailVerified', 'roleId']) {
  @ApiProperty({ type: 'string' })
  password: string;

  @ApiProperty({ type: 'string' })
  confirmPassword: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  media: string;
}

export class UpdateUser extends OmitType(PartialType(CreateUser), ['googleId']) {
  @ApiProperty({ type: 'string', required: false })
  oldPassword: string;
}