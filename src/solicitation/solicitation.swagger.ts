import { ApiProperty, OmitType } from '@nestjs/swagger';

import { SolicitationTypes } from '../solicitationTypes/solicitationTypes.model';
import { User } from '../user/user.swagger';

export class Solicitation {
  @ApiProperty({ type: 'integer', uniqueItems: true, readOnly: true })
  id: number;

  @ApiProperty({ type: 'string', required: false })
  name: string;

  @ApiProperty({ type: 'string', required: false })
  email: string;

  @ApiProperty({ type: 'string' })
  description: string;

  @ApiProperty({ type: 'string', required: false })
  image: string;

  @ApiProperty({ type: 'number' })
  solicitationTypeId: number;

  @ApiProperty({ type: SolicitationTypes, required: false })
  solicitationType: SolicitationTypes;

  @ApiProperty({ type: 'number', required: false })
  userId: number;

  @ApiProperty({ type: User, required: false })
  user: User;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  deletedAt: Date | null;
}

export class CreateSolicitation extends OmitType(Solicitation, ['id', 'createdAt', 'updatedAt', 'deletedAt', 'user', 'solicitationType', 'userId', 'image']) {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  media: string;
}