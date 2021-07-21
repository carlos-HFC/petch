import { compare, hash } from 'bcrypt';
import { format, parseISO } from 'date-fns';
import { BeforeSave, BelongsTo, Column, DataType, DefaultScope, ForeignKey, Model, Table } from 'sequelize-typescript';

import { Role } from '../role/role.model';

@DefaultScope(() => ({
  include: [Role]
}))
@Table({ paranoid: true })
export class User extends Model {
  @Column({
    type: DataType.STRING,
    unique: true,
    defaultValue: null
  })
  googleId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column(DataType.STRING)
  avatar: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  emailVerified: boolean;

  @Column(DataType.STRING)
  tokenVerificationEmail: string;

  @Column(DataType.STRING)
  hash: string;

  @Column(DataType.VIRTUAL)
  password: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  cpf: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  birthday: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  gender: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  cep: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: string;

  @Column(DataType.STRING)
  complement: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  district: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  city: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  uf: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    defaultValue: null
  })
  tokenResetPassword: string;

  @Column({
    type: DataType.STRING,
    defaultValue: null
  })
  tokenResetPasswordExpires: string;

  @ForeignKey(() => Role)
  @Column({ allowNull: false })
  roleId: number;

  @BelongsTo(() => Role)
  role: Role;

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