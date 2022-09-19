import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubEntity } from '../club/club.entity';
import { ClubSocioService } from './club-socio.service';
import { ClubSocioController } from './club-socio.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ClubEntity])],
  providers: [ClubSocioService],
  controllers: [ClubSocioController]
})
export class ClubSocioModule {}
