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
      {
        name: 'Carlos Henrique Faustino Cardoso',
        email: 'chfcchfc96@gmail.com',
        emailVerified: true,
        password: 'Chfc@1234',
        cpf: '06105014880',
        birthday: '1996-12-21',
        gender: 'M',
        cep: '05372100',
        address: 'Rua Deolinda Rodrigues, 592',
        district: 'Jardim Ester',
        city: 'São Paulo',
        uf: 'SP',
        phone: '11994034599',
        roleId: 2
      },
      {
        name: 'Mirella Letícia Drumond',
        email: 'mirella@teste.com',
        emailVerified: true,
        password: 'Mld@1991',
        cpf: '809.972.718-50',
        birthday: '1991-01-04',
        gender: 'F',
        cep: '03174-080',
        address: 'Rua Francisco Gouveia, 717',
        district: 'Quarta Parada',
        city: 'São Paulo',
        uf: 'SP',
        phone: '(11) 99900-8029',
        roleId: 2
      },
      {
        name: 'Guilherme Sérgio Araújo',
        email: 'guilherme@teste.com',
        emailVerified: true,
        password: 'Gsa@1999',
        cpf: '218.218.828-22',
        birthday: '1999-05-05',
        gender: 'M',
        cep: '14808-546',
        address: 'Rua Manoel Cervan Vidal, 231',
        district: 'Jardim Marialice',
        city: 'Araraquara',
        uf: 'SP',
        phone: '(16) 98958-6008',
        roleId: 2
      },
      {
        name: 'Luiz Nathan das Neves',
        email: 'luiz@teste.com',
        emailVerified: true,
        password: 'Lnn@1996',
        cpf: '840.568.298-88',
        birthday: '1996-09-20',
        gender: 'M',
        cep: '14161-152',
        address: 'Rua Antero Luchiari, 856',
        district: 'Shangri-Lá',
        city: 'Sertãozinho',
        uf: 'SP',
        phone: '(16) 99297-4392',
        roleId: 2
      },
      {
        name: 'Liz Lúcia Santos',
        email: 'liz@teste.com',
        emailVerified: true,
        password: 'Lls@1993',
        cpf: '800.179.428-88',
        birthday: '1993-02-27',
        gender: 'F',
        cep: '03682-120',
        address: 'Rua Benjamim Novais, 314',
        district: 'Burgo Paulista',
        city: 'São Paulo',
        uf: 'SP',
        phone: '(11) 98163-1442',
        roleId: 2
      },
      {
        name: 'Débora Benedita Allana Ramos',
        email: 'debora@teste.com',
        emailVerified: true,
        password: 'Dba@1986',
        cpf: '323.687.108-33',
        birthday: '1986-08-18',
        gender: 'F',
        cep: '18701-809',
        address: 'Rua Luiz Sanches Peres, 363',
        district: 'Conjunto Habitacional Mario Emílio Bannwart',
        city: 'Avaré',
        uf: 'SP',
        phone: '(14) 98768-1027',
        roleId: 2
      },
      {
        name: 'Danilo Leonardo Fogaça',
        email: 'danilo@teste.com',
        emailVerified: true,
        password: 'Dlf@1964',
        cpf: '841.952.018-70',
        birthday: '1964-11-18',
        gender: 'M',
        cep: '14056-490',
        address: 'Rua José Gussi, 312',
        district: 'Planalto Verde',
        city: 'Ribeirão Preto',
        uf: 'SP',
        phone: '(16) 98172-1371',
        roleId: 2
      },
    ];
  }
}