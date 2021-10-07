import { ApiProperty } from '@nestjs/swagger';

export class TPetsByGender {
  @ApiProperty({ type: 'number' })
  males: number;

  @ApiProperty({ type: 'number' })
  females: number;
}

export class TPetsByOng {
  @ApiProperty({ type: 'string' })
  name: string;

  @ApiProperty({ type: 'number' })
  quantity: number;
}

export class ScheduleMonth {
  @ApiProperty({ type: 'string' })
  mes: string;

  @ApiProperty({ type: 'number' })
  quantity: number;
}

export class TScheduleByMonth {
  @ApiProperty({ type: 'string' })
  name: string;

  @ApiProperty({ type: ScheduleMonth || [ScheduleMonth] })
  month: ScheduleMonth | ScheduleMonth[];
}

export class TTotalSolicitations {
  @ApiProperty({ type: 'string' })
  name: string;

  @ApiProperty({ type: 'number' })
  quantity: number;
}