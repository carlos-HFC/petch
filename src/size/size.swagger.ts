import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

export class Size {
  @ApiProperty({ type: 'integer', uniqueItems: true, readOnly: true })
  id: number;

  @ApiProperty({ type: 'string' })
  name: string;

  @ApiProperty({ type: 'string' })
  initWeight: string;

  @ApiProperty({ type: 'string' })
  endWeight: string;

  @ApiProperty({ type: 'number' })
  speciesId: number;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  deletedAt: Date | null;
}

export class CreateSize extends OmitType(Size, ['id', 'createdAt', 'updatedAt', 'deletedAt']) { }

export class UpdateSize extends PartialType(CreateSize) { }

// export class FilterSpecies {
//   @ApiProperty({ type: 'boolean', required: false })
//   inactives: boolean;

//   @ApiProperty({ type: 'string', required: false })
//   name: string;
// }