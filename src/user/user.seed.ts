import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';

import { User } from './user.model';

@Seeder({
  model: User,
  runOnlyIfTableIsEmpty: true,
  unique: ['googleId', 'email', 'cpf'],
})
export class UserSeed implements OnSeederInit {
  run() {
    return [
      {
        name: 'Carlos Henrique Faustino Cardoso',
        email: 'chfcchfc96@gmail.com',
        emailVerified: true,
        password: 'Chfc@1234',
        cpf: '42391786816',
        birthday: '1996-12-21',
        gender: 'M',
        cep: '02275060',
        address: 'Tv Vera Lucia Lourenço Fita, 02',
        district: 'Jaçanã',
        city: 'São Paulo',
        uf: 'SP',
        phone: '11952109660',
        roleId: 2
      },
      {
        name: 'Luara Silva Oliveira',
        email: 'luara.oliveira8@gmail.com',
        emailVerified: true,
        password: 'C@ju1208',
        cpf: '55122610029',
        birthday: '1996-08-12',
        gender: 'F',
        cep: '13841155',
        address: 'Rua Carlos Manoel Franco de Campos, 130',
        district: 'Jardim Nova Mogi Guaçu',
        city: 'Mogi Guaçu',
        uf: 'SP',
        phone: '19997111194',
        roleId: 1
      },
    ];
  }
}