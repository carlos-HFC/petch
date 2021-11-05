import { Injectable } from '@nestjs/common';
import { format, getMonth, parseISO, setMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { OngService } from '../ong/ong.service';
import { PetService } from '../pet/pet.service';
import { SchedulingTypesService } from '../schedulingTypes/schedulingTypes.service';
import { SolicitationTypesService } from '../solicitationTypes/solicitationTypes.service';
import { capitalizeFirstLetter } from '../utils';

@Injectable()
export class DashboardService {
  constructor(
    private petService: PetService,
    private ongService: OngService,
    private schedulingTypesService: SchedulingTypesService,
    private solicitationTypeService: SolicitationTypesService,
  ) { }

  async petsByGender() {
    const pets = await this.petService.petsByGender();

    const males = pets.filter(pet => pet.gender === 'M').length;
    const females = pets.filter(pet => pet.gender === 'F').length;

    return [
      {
        gender: "Macho",
        total: males
      },
      {
        gender: "Fêmea",
        total: females
      },
    ];
  }

  async petsByOng() {
    const ongs = await this.ongService.petsByOng();

    return ongs.map(ong => {
      return {
        name: ong.name,
        quantity: ong.pets.length
      };
    });
  }

  async scheduleByMonth(month?: number) {
    const types = await this.schedulingTypesService.dash();

    const displayMonth = (value: number) => setMonth(new Date(), value);

    if (month) {
      const total = types.map(schedule => {
        return {
          name: schedule.name,
          month: [
            {
              quantity: schedule.schedulings.filter(sch => getMonth(parseISO(sch.date)) + 1 === month).length,
              mes: capitalizeFirstLetter(format(displayMonth(month - 1), 'MMMM', { locale: ptBR }))
            }
          ]
        };
      });

      return total;
    } else {
      const total = types.map(schedule => {
        return {
          name: schedule.name,
          month: schedule.schedulings.map(sch => {
            return {
              mes: capitalizeFirstLetter(format(displayMonth(getMonth(parseISO(sch.date))), 'MMMM', { locale: ptBR })),
              quantity: schedule.schedulings.filter(sc => getMonth(parseISO(sc.date)) === getMonth(parseISO(sch.date))).length
            };
          })
        };
      });

      return total.map(t => {
        return {
          name: t.name,
          month: [...new Map(t.month.map(m => [m['quantity'], m])).values()]
        };
      });
    }
  }

  async totalSolicitations() {
    const solicitationTypes = await this.solicitationTypeService.dash();

    return solicitationTypes.map(type => {
      return {
        name: type.name,
        quantity: type.solicitations.filter(solicitation => solicitation.solicitationTypesId === type.id).length
      };
    });
  }
}