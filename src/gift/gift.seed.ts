import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { Gift } from './gift.model';

@Seeder({
  model: Gift,
  runOnlyIfTableIsEmpty: true,
})
export class GiftSeed implements OnSeederInit {
  run() {
    return [
      {
        name: 'Coleira',
        color: 'Preto',
        size: 'P',
      },
      {
        name: 'Petisco',
        weight: '1kg',
        taste: 'churrasco',
      },
      {
        name: 'Cama',
        color: 'cinza',
        size: 'G',
      },
    ];
  }
}