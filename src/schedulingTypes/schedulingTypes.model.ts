import { ApiProperty } from '@nestjs/swagger';
import { AfterSync, Column, DataType, HasMany, Model, Scopes, Table } from 'sequelize-typescript';

import { Scheduling } from '../scheduling/scheduling.model';

@Scopes(() => ({
  dash: {
    attributes: ['id', 'name'],
    include: [
      {
        model: Scheduling,
        where: { canceledAt: null },
        attributes: ['id', 'date']
      }
    ]
  }
}))
@Table({ paranoid: true })
export class SchedulingTypes extends Model {
  @ApiProperty({ uniqueItems: true, type: 'integer', readOnly: true })
  id: number;

  @ApiProperty({ type: 'string' })
  @Column(DataType.STRING)
  name: string;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  deletedAt: Date | null;

  @HasMany(() => Scheduling)
  schedulings: Scheduling[];

  @AfterSync
  static async createAll() {
    process.env.NODE_ENV !== 'dev' && await this.bulkCreate([
      { id: 1, name: "Vacina" },
      { id: 2, name: "Banho" },
      { id: 3, name: "Medicação" },
    ], { ignoreDuplicates: true });
  }
}