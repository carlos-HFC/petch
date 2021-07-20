import { ApiProperty } from '@nestjs/swagger';
import { BeforeSave, Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ paranoid: true })
export class SchedulingTypes extends Model {
  @ApiProperty({ uniqueItems: true, type: 'integer', readOnly: true })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    unique: true
  })
  id: number;

  @ApiProperty({ type: 'string' })
  @Column({
    type: DataType.STRING
  })
  name: string;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  deletedAt: Date | null;

  @BeforeSave
  static async upperFirst(schedulingTypes: SchedulingTypes) {
    return schedulingTypes.name = schedulingTypes.name.charAt(0).toUpperCase() + schedulingTypes.name.slice(1);
  }
}