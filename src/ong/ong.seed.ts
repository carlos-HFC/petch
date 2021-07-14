import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { Ong } from './ong.model';

@Seeder({
  model: Ong,
  runOnlyIfTableIsEmpty: true,
  unique: 'name'
})
export class OngSeed implements OnSeederInit {
  run() {
    return [
      {
        name: 'Dogs do Coração',
        email: 'doguineos@dogscore.com',
        phone1: '1128169333',
        phone2: '11985856127',
        cep: '05850245',
        address: 'Rua Francisco Soares de Farias, 939',
        district: 'Parque Santo Antônio',
        city: 'São Paulo',
        uf: 'SP',
        actingStates: 'SP, RJ, MG, ES',
      },
      {
        name: 'Pet Place',
        email: 'place@petplace.com.br',
        phone1: '4829542922',
        phone2: '48995972859',
        cep: '88106692',
        address: 'Rua Salvador Silva Porto, 838',
        district: 'Forquilhinha',
        city: 'São José',
        uf: 'SC',
        actingStates: 'SC, PR, SP',
      },
      {
        name: 'ONG Melhor Amigo',
        email: 'OMA@melhoramigo.com.br',
        phone1: '8827492520',
        phone2: '88994753142',
        phone3: '8825555591',
        cep: '62030705',
        address: 'Rua Pricesa do Norte, 904',
        district: 'Cidade Pedro Mendes Carneiro',
        city: 'Sobral',
        uf: 'CE',
        actingStates: 'CE, PE',
      },
    ];
  }
}