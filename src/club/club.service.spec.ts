import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { ClubEntity } from './club.entity';
import { ClubService } from './club.service';

describe('ClubService', () => {
  let service: ClubService;
  let repository: Repository<ClubEntity>;
  let clubsList: ClubEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubService],
    }).compile();

    service = module.get<ClubService>(ClubService);
    repository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    clubsList = [];
    for(let i = 0; i < 5; i++){
        const club: ClubEntity = await repository.save({
        nombre: faker.lorem.sentence(),
        fechaFundacion: faker.date.past(),
        imagen: faker.lorem.sentence(),
        descripcion: faker.lorem.sentence()})
        clubsList.push(club);
    }
  }

  it('findAll debe retornar todos los clubs', async () => {
    const club: ClubEntity[] = await service.findAll();
    expect(club).not.toBeNull();
    expect(club).toHaveLength(clubsList.length);
  });

  it('findOne debe retornar un club por id', async () => {
    const storedClub: ClubEntity = clubsList[0];
    const club: ClubEntity = await service.findOne(storedClub.id);
    expect(club).not.toBeNull();
    expect(club.nombre).toEqual(storedClub.nombre)
    expect(club.fechaFundacion).toEqual(storedClub.fechaFundacion)
    expect(club.imagen).toEqual(storedClub.imagen)
    expect(club.descripcion).toEqual(storedClub.descripcion)
  });

  it('findOne debe retornar una excepcion para un club pcon id invalido', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El club con el id dado no existe")
  });

  it('create debe retornar un nuevo club', async () => {
    const club: ClubEntity = {
      id: "",
      nombre: faker.lorem.sentence(),
      fechaFundacion: faker.date.past(),
      imagen: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      socios: [],
    }

    const newClub: ClubEntity = await service.create(club);
    expect(newClub).not.toBeNull();

    const storedClub: ClubEntity = await repository.findOne({where: {id: newClub.id}})
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombre).toEqual(newClub.nombre)
    expect(storedClub.fechaFundacion).toEqual(newClub.fechaFundacion)
    expect(storedClub.imagen).toEqual(newClub.imagen)
    expect(storedClub.descripcion).toEqual(newClub.descripcion)
  });

  it('update debe modificar a un club', async () => {
    const club: ClubEntity = clubsList[0];
    club.nombre = "New name";

    const updatedClub: ClubEntity = await service.update(club.id, club);
    expect(updatedClub).not.toBeNull();
  
    const storedClub: ClubEntity = await repository.findOne({ where: { id: club.id } })
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombre).toEqual(club.nombre)
  });
 
  it('update debe arrojar una excepcion para un club invalido', async () => {
    let club: ClubEntity = clubsList[0];
    club = {
      ...club, nombre: "New name"
    }
    await expect(() => service.update("0", club)).rejects.toHaveProperty("message", "El club con el id dado no fue encontrado")
  });

  it('delete debe eliminar un club', async () => {
    const club: ClubEntity = clubsList[0];
    await service.delete(club.id);
  
    const deletedclub: ClubEntity = await repository.findOne({ where: { id: club.id } })
    expect(deletedclub).toBeNull();
  });

  it('delete debe arrojar una excepcion para un club innvalido', async () => {
    const club: ClubEntity = clubsList[0];
    await service.delete(club.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El club con el id dado no fue encontrado")
  });


});
