import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

import { Species } from '../species/species.model';

export class Size {
  @ApiProperty({ type: 'integer', uniqueItems: true, readOnly: true })
  id: number;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Nome do Porte é obrigatório' })
  @Transform(({ value }) => value.trim())
  @IsString()
  name: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Peso Inicial é obrigatório' })
  @Transform(({ value }) => value.trim())
  @IsString()
  initWeight: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Peso Final é obrigatório' })
  @Transform(({ value }) => value.trim())
  @IsString()
  endWeight: string;

  @ApiProperty({ type: 'number' })
  @IsNotEmpty({ message: 'Espécie é obrigatória' })
  @Transform(({ value }) => value.trim())
  speciesId: number;

  @ApiProperty({ type: Species, required: false })
  species: Species;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  deletedAt: Date | null;
}

export class TCreateSize extends OmitType(Size, ['id', 'speciesId', 'species', 'createdAt', 'updatedAt', 'deletedAt']) { }

export class TUpdateSize extends PartialType(TCreateSize) { }