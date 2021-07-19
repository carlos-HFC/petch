import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ paranoid: true })
export class Role extends Model {
  @ApiProperty({
    example: 1,
    uniqueItems: true,
    type: 'integer'
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    unique: true
  })
  id: number;

  @ApiProperty({
    example: 'Admin',
    type: 'string'
  })
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name: string;

  @ApiProperty({
    example: '2020-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date',
    required: false
  })
  createdAt: Date;

  @ApiProperty({
    example: '2020-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date',
    required: false
  })
  updatedAt: Date;

  @ApiProperty({
    example: null,
    type: 'string',
    format: 'date',
    required: false
  })
  deletedAt: Date | null;
}