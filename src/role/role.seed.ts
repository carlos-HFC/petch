import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { Role } from './role.model';

@Seeder({
  model: Role,
  runOnlyIfTableIsEmpty: true
})
export class RoleSeed implements OnSeederInit {
  run() {
    return [
      { type: "Admin" },
      { type: "Adotante" },
    ];
  }
}