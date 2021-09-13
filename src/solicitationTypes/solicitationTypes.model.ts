import { ApiProperty } from '@nestjs/swagger';
import { AutoIncrement, BeforeSave, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

import { capitalizeFirstLetter } from '../utils';

@Table({ paranoid: true })
export class SolicitationTypes extends Model {
  @ApiProperty({ uniqueItems: true, type: 'integer', readOnly: true })
  @PrimaryKey
  @AutoIncrement
  @Column
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
  static async upperFirst(solicitationTypes: SolicitationTypes) {
    return solicitationTypes.name = capitalizeFirstLetter(solicitationTypes.name);
  }
}