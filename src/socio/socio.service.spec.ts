import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { SocioEntity } from './socio.entity';
import { SocioService } from './socio.service';
import { faker } from '@faker-js/faker';

describe('SocioService', () => {
  let service: SocioService;
  let repository: Repository<SocioEntity>;
  let sociosList: SocioEntity[];


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioService],
    }).compile();

    service = module.get<SocioService>(SocioService);
    repository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    sociosList = [];
    for(let i = 0; i < 5; i++){
        const socio: SocioEntity = await repository.save({
        usuario: faker.lorem.sentence(),
        correo: faker.lorem.sentence(),
        fechaNacimiento: faker.date.past(),})
        sociosList.push(socio);
    }
  }

  it('findAll debe retornar todos los socios', async () => {
    const socio: SocioEntity[] = await service.findAll();
    expect(socio).not.toBeNull();
    expect(socio).toHaveLength(sociosList.length);
  });

  it('findOne debe retornar un socio por id', async () => {
    const storedSocio: SocioEntity = sociosList[0];
    const socio: SocioEntity = await service.findOne(storedSocio.id);
    expect(socio).not.toBeNull();
    expect(socio.usuario).toEqual(storedSocio.usuario)
    expect(socio.correo).toEqual(storedSocio.correo)
    expect(socio.fechaNacimiento).toEqual(storedSocio.fechaNacimiento)
  });

  it('findOne debe retornar una excepcion para un socio pcon id invalido', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El socio con el id dado no fue encontrado")
  });

  it('create debe retornar un nuevo socio', async () => {
    const socio: SocioEntity = {
      id: "",
      usuario: faker.lorem.sentence(),
      correo: faker.lorem.sentence(),
      fechaNacimiento: faker.date.past(),
      clubs: [],
    }

    const newsocio: SocioEntity = await service.create(socio);
    expect(newsocio).not.toBeNull();

    const storedsocio: SocioEntity = await repository.findOne({where: {id: newsocio.id}})
    expect(storedsocio).not.toBeNull();
    expect(storedsocio.usuario).toEqual(newsocio.usuario)
    expect(storedsocio.correo).toEqual(newsocio.correo)
    expect(storedsocio.fechaNacimiento).toEqual(newsocio.fechaNacimiento)
  });

  it('update debe modificar a un socio', async () => {
    const socio: SocioEntity = sociosList[0];
    socio.usuario = "New name";

    const updatedSocio: SocioEntity = await service.update(socio.id, socio);
    expect(updatedSocio).not.toBeNull();
  
    const storedsocio: SocioEntity = await repository.findOne({ where: { id: socio.id } })
    expect(storedsocio).not.toBeNull();
    expect(storedsocio.usuario).toEqual(socio.usuario)
  });
 
  it('update debe arrojar una excepcion para un socio invalido', async () => {
    let socio: SocioEntity = sociosList[0];
    socio = {
      ...socio, usuario: "New name"
    }
    await expect(() => service.update("0", socio)).rejects.toHaveProperty("message", "El socio con el id dado no fue encontrado")
  });

  it('delete debe eliminar un socio', async () => {
    const socio: SocioEntity = sociosList[0];
    await service.delete(socio.id);
  
    const deletedsocio: SocioEntity = await repository.findOne({ where: { id: socio.id } })
    expect(deletedsocio).toBeNull();
  });

  it('delete debe arrojar una excepcion para un socio innvalido', async () => {
    const socio: SocioEntity = sociosList[0];
    await service.delete(socio.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El socio con el id dado no fue encontrado")
  });




});
