import { BeforeSave, BelongsTo, Column, DataType, DefaultScope, ForeignKey, Model, Table } from 'sequelize-typescript';

import { Media } from '../medias/media.model';

@DefaultScope(() => ({
  include: [Media]
}))
@Table({ paranoid: true })
export class Partner extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  phone1: string;

  @Column(DataType.STRING)
  phone2: string;

  @Column(DataType.STRING)
  phone3: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  cep: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  address: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  district: string;

  @Column(DataType.STRING)
  complement: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  city: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  uf: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  services: string;

  @ForeignKey(() => Media)
  @Column
  mediaId: number;

  @BelongsTo(() => Media)
  media: Media;

  @BeforeSave
  static async formatData(partner: Partner) {
    partner.uf = partner.uf.toUpperCase();
    partner.cep = partner.cep.replace(/[\s-]/g, '');
    partner.phone1 = partner.phone1.replace(/[\s()-]/g, '');
    partner.phone2 = partner.phone2?.replace(/[\s()-]/g, '');
    partner.phone3 = partner.phone3?.replace(/[\s()-]/g, '');
  }
}