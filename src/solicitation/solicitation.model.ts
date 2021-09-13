import { AutoIncrement, BeforeSave, BelongsTo, Column, DataType, DefaultScope, ForeignKey, Model, NotEmpty, PrimaryKey, Table } from 'sequelize-typescript';

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
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  email: string;

  @NotEmpty({ msg: "Campo 'Descrição' não pode ser vazio" })
  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  description: string;

  @Column(DataType.STRING)
  image: string;

  @NotEmpty({ msg: "Campo 'Tipo de Solicitação' não pode ser vazio" })
  @ForeignKey(() => SolicitationTypes)
  @Column({ allowNull: false })
  solicitationTypeId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => SolicitationTypes)
  solicitationTypes: SolicitationTypes;

  @BelongsTo(() => User)
  user: User;

  @BeforeSave
  static async formatData(solicitation: Solicitation) {
    if (solicitation.email) solicitation.email = solicitation.email.toLowerCase();
  }
}