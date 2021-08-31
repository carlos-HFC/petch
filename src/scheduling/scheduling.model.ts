import { format, parseISO } from 'date-fns';
import { BeforeSave, BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { SchedulingTypes } from '../schedulingTypes/schedulingTypes.model';
import { User } from '../user/user.model';

@Table({ paranoid: true })
export class Scheduling extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  date: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  initHour: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  endHour: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  confirmed: boolean;

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

  @BeforeSave
  static async formatData(scheduling: Scheduling) {
    scheduling.date = format(parseISO(scheduling.date), 'yyyy-MM-dd');
    scheduling.initHour = format(parseISO(scheduling.initHour), 'HH:mm');
    scheduling.endHour = format(parseISO(scheduling.endHour), 'HH:mm');
  }
}