import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClubEntity } from '../club/club.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SocioEntity } from '../socio/socio.entity';
import { Repository } from 'typeorm';
import { ClubSocioService } from './club-socio.service';

describe('ClubSocioService', () => {
  let service: ClubSocioService;
  let clubRepository: Repository<ClubEntity>;
  let socioRepository: Repository<SocioEntity>;
  let club: ClubEntity;
  let sociosList : SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubSocioService],
    }).compile();

    service = module.get<ClubSocioService>(ClubSocioService);
    clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    socioRepository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    socioRepository.clear();
    clubRepository.clear();
 
    sociosList = [];
    for(let i = 0; i < 5; i++){
        const socio: SocioEntity = await socioRepository.save({
          usuario: faker.lorem.sentence(),
          correo: faker.lorem.sentence(),
          fechaNacimiento: faker.date.past(),
        })
        sociosList.push(socio);
    }
 
    club = await clubRepository.save({
      nombre: faker.lorem.sentence(),
      fechaFundacion: faker.date.past(),
      imagen: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      socios: sociosList
    })
  }

  
  it('addSocioClub debe agregar un socio a un club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      usuario: faker.lorem.sentence(),
      correo: faker.lorem.sentence(),
      fechaNacimiento: faker.date.past(),
    });

    const newClub:ClubEntity = await clubRepository.save({
      nombre: faker.lorem.sentence(),
      fechaFundacion: faker.date.past(),
      imagen: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
    })

    const result: ClubEntity = await service.addSocioCLub(newClub.id, newSocio.id);
    
    expect(result.socios.length).toBe(1);
    expect(result.socios[0]).not.toBeNull();
    expect(result.socios[0].usuario).toBe(newSocio.usuario)
    expect(result.socios[0].correo).toBe(newSocio.correo)
    expect(result.socios[0].fechaNacimiento).toStrictEqual(newSocio.fechaNacimiento)
  });

  it('addSocioClub debe retornar una excepcion para un socio invalido', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.lorem.sentence(),
      fechaFundacion: faker.date.past(),
      imagen: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
    })

    await expect(() => service.addSocioCLub(newClub.id, "0")).rejects.toHaveProperty("message", "El socio con el id no fue encontrado");
  });

  it('addSocioClub debe retornar una excepcion para un club invalido', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      usuario: faker.lorem.sentence(),
      correo: faker.lorem.sentence(),
      fechaNacimiento: faker.date.past(),
    });

    await expect(() => service.addSocioCLub("0", newSocio.id)).rejects.toHaveProperty("message", "El club con el id no fue encontrado");
  });

  it('findSocioByClubIdsocioId debe retornar un socio por un club', async () => {
    const socio: SocioEntity = sociosList[0];
    const storedsocio: SocioEntity = await service.findSocioByClubIdSocioId(club.id, socio.id, )
    expect(storedsocio).not.toBeNull();
    expect(storedsocio.usuario).toBe(socio.usuario);
    expect(storedsocio.correo).toBe(socio.correo);
    expect(storedsocio.fechaNacimiento).toStrictEqual(socio.fechaNacimiento);
  });

  it('findSocioByClubIdSocioId debe retornaruna excepcion por un socio invalido', async () => {
    await expect(()=> service.findSocioByClubIdSocioId(club.id, "0")).rejects.toHaveProperty("message", "El socio con el id no fue encontrado"); 
  });

  it('findSocioByClubIdSocioId debe retornar una excepcion por un club invalido', async () => {
    const socio: SocioEntity = sociosList[0]; 
    await expect(()=> service.findSocioByClubIdSocioId("0", socio.id)).rejects.toHaveProperty("message", "El club con el id no fue encontrado"); 
  });

  it('findSocioByClubIdSocioId debe arrojar una excepcion cuando un socio no esté asociado a un club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      usuario: faker.lorem.sentence(),
      correo: faker.lorem.sentence(),
      fechaNacimiento: faker.date.past(),
    });
    await expect(()=> service.findSocioByClubIdSocioId(club.id, newSocio.id)).rejects.toHaveProperty("message", "El socio con el id no esta asociado al club"); 
  });

  it('findSociosByClubId debe retornar todos los socios de un club', async ()=>{
    const socios: SocioEntity[] = await service.findSociosByClubId(club.id);
    expect(socios.length).toBe(5)
  });

  it('findSociosByClubId debe arrojar una excepcion para un club invalido', async () => {
    await expect(()=> service.findSociosByClubId("0")).rejects.toHaveProperty("message", "El club con el id no fue encontrado"); 
  });

  it('associateSociosClub debe actualizar la lista de un museo', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      usuario: faker.lorem.sentence(),
      correo: faker.lorem.sentence(),
      fechaNacimiento: faker.date.past(),
    });

    const updatedClub: ClubEntity = await service.associateSociosClub(club.id, [newSocio]);
    expect(updatedClub.socios.length).toBe(1);
    expect(updatedClub.socios[0].usuario).toBe(newSocio.usuario);
    expect(updatedClub.socios[0].correo).toBe(newSocio.correo);
    expect(updatedClub.socios[0].fechaNacimiento).toBe(newSocio.fechaNacimiento);
  });

  it('associateSociosClub debe arrojar una excepcion de un club invalido', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      usuario: faker.lorem.sentence(),
      correo: faker.lorem.sentence(),
      fechaNacimiento: faker.date.past(),
    });

    await expect(()=> service.associateSociosClub("0", [newSocio])).rejects.toHaveProperty("message", "El club con el id no fue encontrado"); 
  });

  it('associateSociosClub debe arrojar una excepcion por un socio invalido', async () => {
    const newSocio: SocioEntity = sociosList[0];
    newSocio.id = "0";

    await expect(()=> service.associateSociosClub(club.id, [newSocio])).rejects.toHaveProperty("message", "El socio con el id no se encontró"); 
  });

  it('deletesocioToclub debe eliminar un socio de un club', async () => {
    const socio: SocioEntity = sociosList[0];
    
    await service.deleteSocioClub(club.id, socio.id);

    const storedclub: ClubEntity = await clubRepository.findOne({where: {id: club.id}, relations: ["socios"]});
    const deletedsocio: SocioEntity = storedclub.socios.find(a => a.id === socio.id);

    expect(deletedsocio).toBeUndefined();

  });

  it('deletesocioToclub debe arrojar una excepcion para un socio invalido', async () => {
    await expect(()=> service.deleteSocioClub(club.id, "0")).rejects.toHaveProperty("message", "El socio con el id no se encontró"); 
  });

  it('deletesocioToclub debe arrojar una excepcion para un club invalido', async () => {
    const socio: SocioEntity = sociosList[0];
    await expect(()=> service.deleteSocioClub("0", socio.id)).rejects.toHaveProperty("message", "El club con el id no fue encontrado"); 
  });

  it('deletesocioToclub debe arrojar una excepcion por un socio son asociado', async () => {
    const newsocio: SocioEntity = await socioRepository.save({
      usuario: faker.lorem.sentence(),
      correo: faker.lorem.sentence(),
      fechaNacimiento: faker.date.past(),
    });

    await expect(()=> service.deleteSocioClub(club.id, newsocio.id)).rejects.toHaveProperty("message", "El socio con el id no esta asociado al club"); 
  }); 




});
