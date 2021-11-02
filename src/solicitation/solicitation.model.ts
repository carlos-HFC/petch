import { AfterSync, BeforeSave, BelongsTo, Column, DataType, DefaultScope, ForeignKey, Model, NotEmpty, Table } from 'sequelize-typescript';

import { SolicitationTypes } from '../solicitationTypes/solicitationTypes.model';
import { User } from '../user/user.model';

@DefaultScope(() => ({
  include: [
    {
      model: SolicitationTypes,
      attributes: ['name']
    },
    {
      model: User,
      attributes: ['name', 'email']
    }
  ],
  order: [['id', 'asc']]
}))
@Table({ paranoid: true })
export class Solicitation extends Model {
  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  description: string;

  @ForeignKey(() => SolicitationTypes)
  @Column({ allowNull: false })
  solicitationTypeId: number;

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  userId: number;

  @BelongsTo(() => SolicitationTypes)
  solicitationTypes: SolicitationTypes;

  @BelongsTo(() => User)
  user: User;
}