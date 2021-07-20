import { ApiProperty } from '@nestjs/swagger';
import { compare, hash } from 'bcrypt';
import { format, parseISO } from 'date-fns';
import { BeforeSave, BelongsTo, Column, DataType, DefaultScope, ForeignKey, Model, Table } from 'sequelize-typescript';

import { Role } from '../role/role.model';

@DefaultScope(() => ({
  include: [Role]
}))
@Table({ paranoid: true })
export class User extends Model {
  @ApiProperty({ uniqueItems: true, type: 'integer', readOnly: true })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    unique: true
  })
  id: number;

  @ApiProperty({ type: 'string', uniqueItems: true, required: false })
  @Column({
    type: DataType.STRING,
    unique: true,
    defaultValue: null
  })
  googleId: string;

  @ApiProperty({ type: 'string' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({ type: 'string', required: false })
  @Column(DataType.STRING)
  avatar: string;

  @ApiProperty({ type: 'string', uniqueItems: true })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @ApiProperty({ type: 'boolean', default: false })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  emailVerified: boolean;

  @ApiProperty({ type: 'string', required: false })
  @Column(DataType.STRING)
  tokenVerificationEmail: string;

  @ApiProperty({ type: 'string', required: false })
  @Column(DataType.STRING)
  hash: string;

  @Column(DataType.VIRTUAL)
  password: string;

  @ApiProperty({ type: 'string', uniqueItems: true })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  cpf: string;

  @ApiProperty({ type: 'string' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  birthday: string;

  @ApiProperty({ type: 'string', enum: ['M', 'F', 'O'] })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  gender: string;

  @ApiProperty({ type: 'string' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  cep: string;

  @ApiProperty({ type: 'string' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: string;

  @ApiProperty({ type: 'string', required: false })
  @Column(DataType.STRING)
  complement: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  district: string;

  @ApiProperty({ type: 'string' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  city: string;

  @ApiProperty({ type: 'string' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  uf: string;

  @ApiProperty({ type: 'string' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @ApiProperty({ type: 'string', required: false })
  @Column({
    type: DataType.STRING,
    defaultValue: null
  })
  tokenResetPassword: string;

  @ApiProperty({ type: 'string', required: false })
  @Column({
    type: DataType.STRING,
    defaultValue: null
  })
  tokenResetPasswordExpires: string;

  @ApiProperty({ type: 'number' })
  @ForeignKey(() => Role)
  @Column({ allowNull: false })
  roleId: number;

  @BelongsTo(() => Role)
  role: Role;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  deletedAt: Date | null;

  @BeforeSave
  static async hashPass(user: User) {
    if (user.password) return user.hash = await hash(user.password, 10);
  }

  @BeforeSave
  static async formatData(user: User) {
    user.email = user.email.toLowerCase();
    user.birthday = format(parseISO(user.birthday), 'yyyy-MM-dd');
    user.uf = user.uf.toUpperCase();
    user.gender = user.gender.toUpperCase();
    user.cpf = user.cpf.replace(/[.-\s]/g, '');
    user.cep = user.cep.replace(/[-\s]/g, '');
    user.phone = user.phone.replace(/[()-\s]/g, '');
  }

  checkPass(password: string) {
    return compare(password, this.hash);
  }
}