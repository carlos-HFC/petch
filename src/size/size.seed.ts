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
        initWeight: "0.5kg",
        endWeight: "6kg",
        speciesId: 1,
      },
      {
        name: "Pequeno",
        initWeight: "6kg",
        endWeight: "15kg",
        speciesId: 1,
      },
      {
        name: "Médio",
        initWeight: "15kg",
        endWeight: "25kg",
        speciesId: 1,
      },
      {
        name: "Grande",
        initWeight: "25kg",
        endWeight: "45kg",
        speciesId: 1,
      },
      {
        name: "Extra Grande",
        initWeight: "45kg",
        endWeight: "90kg",
        speciesId: 1,
      },
      {
        name: "Pequeno",
        initWeight: "2kg",
        endWeight: "3kg",
        speciesId: 2,
      },
      {
        name: "Médio",
        initWeight: "3kg",
        endWeight: "5kg",
        speciesId: 2,
      },
      {
        name: "Grande",
        initWeight: "5kg",
        endWeight: "7kg",
        speciesId: 2,
      },
    ];
  }
}