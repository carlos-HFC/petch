import { BeforeSave, Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ paranoid: true })
export class SchedulingTypes extends Model {
  @Column({
    type: DataType.STRING
  })
  name: string;

  @BeforeSave
  static async upperFirst(schedulingTypes: SchedulingTypes) {
    return schedulingTypes.name = schedulingTypes.name.charAt(0).toUpperCase() + schedulingTypes.name.slice(1);
  }
}