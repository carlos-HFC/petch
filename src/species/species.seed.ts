import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { Species } from './species.model';

@Seeder({
  model: Species,
  runOnlyIfTableIsEmpty: true,
  unique: 'name'
})
export class SpeciesSeed implements OnSeederInit {
  run() {
    return [
      { name: "Cachorro" },
      { name: "Gato" },
    ];
  }
}