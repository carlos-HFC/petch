import { BelongsTo, Column, DataType, DefaultScope, ForeignKey, Model, NotEmpty, Table } from 'sequelize-typescript';

import { SchedulingTypes } from '../schedulingTypes/schedulingTypes.model';
import { User } from '../user/user.model';

@DefaultScope(() => ({
  include: [User, SchedulingTypes]
}))
@Table({ paranoid: true })
export class Scheduling extends Model {
  @NotEmpty({ msg: "Campo 'Data' não pode ser vazio" })
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: null,
  })
  canceledAt: Date;

  @NotEmpty({ msg: "Campo 'Tipo de Agendamento' não pode ser vazio" })
  @ForeignKey(() => SchedulingTypes)
  @Column({ allowNull: false })
  schedulingTypesId: number;

  @BelongsTo(() => SchedulingTypes)
  schedulingTypes: SchedulingTypes;

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}