import { Controller, Post } from '@nestjs/common';

import { GiftService } from './gift/gift.service';
import { OngService } from './ong/ong.service';
import { PartnerService } from './partner/partner.service';
import { RoleService } from './role/role.service';
import { SchedulingTypesService } from './schedulingTypes/schedulingTypes.service';
import { SolicitationTypesService } from './solicitationTypes/solicitationTypes.service';
import { SpeciesService } from './species/species.service';
import { UserService } from './user/user.service';

@Controller('app')
export class AppController {
  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private giftService: GiftService,
    private ongService: OngService,
    private partnerService: PartnerService,
    private schedulingTypesService: SchedulingTypesService,
    private solicitationTypesService: SolicitationTypesService,
    private speciesService: SpeciesService,
  ) { }

  @Post()
  async createAll() {
    return await Promise.all([
      this.roleService.createRoles(),
      this.schedulingTypesService.createSchedulingTypes(),
      this.solicitationTypesService.createSolicitationTypes(),
      this.speciesService.createSpecies(),
      this.ongService.createOngs(),
      this.partnerService.createPartners(),
      this.giftService.createGifts(),
      this.userService.createUsers()
    ]);
  }
}