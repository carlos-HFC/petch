import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { Size } from './size.model';

@Seeder({
  model: Size,
  runOnlyIfTableIsEmpty: true,
  containsForeignKeys: true,
  foreignDelay: 1500
})
export class SizeSeed implements OnSeederInit {
  run() {
    return [
      {
        name: "Mini",
        initWeight: "0.5",
        endWeight: "6",
        speciesId: 1,
      },
      {
        name: "Pequeno",
        initWeight: "6",
        endWeight: "15",
        speciesId: 1,
      },
      {
        name: "Médio",
        initWeight: "15",
        endWeight: "25",
        speciesId: 1,
      },
      {
        name: "Grande",
        initWeight: "25",
        endWeight: "45",
        speciesId: 1,
      },
      {
        name: "Extra Grande",
        initWeight: "45",
        endWeight: "90",
        speciesId: 1,
      },
      {
        name: "Pequeno",
        initWeight: "2",
        endWeight: "3",
        speciesId: 2,
      },
      {
        name: "Médio",
        initWeight: "3",
        endWeight: "5",
        speciesId: 2,
      },
      {
        name: "Grande",
        initWeight: "5",
        endWeight: "7",
        speciesId: 2,
      },
    ];
  }
}