import { Body, Controller,  Delete,  Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { SocioDto } from '../socio/socio.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ClubSocioService } from './club-socio.service';
import { plainToInstance } from 'class-transformer';
import { SocioEntity } from '../socio/socio.entity';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubSocioController {
    constructor(private readonly clubSocioService: ClubSocioService){}

    @Post(':clubId/socios/:socioId')
    async addsocioclub(@Param('clubId') clubId: string, @Param('socioId') socioId: string){
       return await this.clubSocioService.addSocioCLub(clubId, socioId);
    }

    @Get(':clubId/socios/:socioId')
    async findsocioByclubIdsocioId(@Param('clubId') clubId: string, @Param('socioId') socioId: string){
       return await this.clubSocioService.findSocioByClubIdSocioId(clubId, socioId);
    }
    
    @Get(':clubId/socios')
    async findsociosByclubId(@Param('clubId') clubId: string){
       return await this.clubSocioService.findSociosByClubId(clubId);
    }

    @Put(':clubId/socios')
    async associatesociosclub(@Body() sociosDto: SocioDto[], @Param('clubId') clubId: string){
       const socios = plainToInstance(SocioEntity, sociosDto)
       return await this.clubSocioService.associateSociosClub(clubId, socios);
    }

    @Delete(':clubId/socios/:socioId')
    @HttpCode(204)
    async deletesocioclub(@Param('clubId') clubId: string, @Param('socioId') socioId: string){
       return await this.clubSocioService.deleteSocioClub(clubId, socioId);
    }

}
