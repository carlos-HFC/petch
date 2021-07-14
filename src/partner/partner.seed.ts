import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { Partner } from './partner.model';

@Seeder({
  model: Partner,
  runOnlyIfTableIsEmpty: true,
  unique: ['name', 'email']
})
export class PartnerSeed implements OnSeederInit {
  run() {
    return [
      {
        name: 'Petshop dos Pets',
        email: 'pet@petshopdospets.com.br',
        phone1: '1925365725',
        phone2: '19987796995',
        cep: '13467350',
        address: 'Avenida ASTA, 719',
        district: 'Vila Vitória',
        city: 'Americana',
        uf: 'SP',
        services: 'Banho e Tosa, Vacinação, Venda de produtos licenciados',
      },
      {
        name: 'Photografia Sublime',
        email: 'photo@photosublime.com',
        phone1: '1137842311',
        phone2: '11983447444',
        phone3: '11997925182',
        cep: '01231001',
        address: 'Rua Baronesa de Itu, 893',
        district: 'Santa Cecília',
        city: 'São Paulo',
        uf: 'SP',
        services: 'Fotografias, Formaturas, Casamentos, Baile Debutante',
      },
      {
        name: 'Focinhos e Patas',
        email: 'foci@focinhospatas.com',
        phone1: '1226174710',
        cep: '12720170',
        address: 'Avenida Robert Douglas, 151',
        district: 'Vila Doutor João Batista',
        city: 'Cruzeiro',
        uf: 'SP',
        services: 'Veterinária, Banho e Rosa, Venda de produtos, Dog Walker',
      },
    ];
  }
}