import { Controller, Get, Query } from '@nestjs/common';

import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private dashboardService: DashboardService
  ) { }

  @Get('/pets')
  async petsByGender() {
    return await this.dashboardService.petsByGender();
  }

  @Get('/ongs')
  async ongsByGender() {
    return await this.dashboardService.petsByOng();
  }

  @Get('/schedulings')
  async scheduleByMonth(@Query('month') month: number) {
    return await this.dashboardService.scheduleByMonth(month);
  }

  @Get('/solicitations')
  async totalSolicitations() {
    return await this.dashboardService.totalSolicitations();
  }
}