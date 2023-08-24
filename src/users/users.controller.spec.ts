import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { NotFoundException, NotImplementedException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findAll: () => {
        return Promise.resolve([
          { id: 1, email: 'test@example.com', password: 'Testing99!' },
        ] as User[]);
      },
      findByEmail: (email: string) => {
        return Promise.resolve({
          id: 99,
          email,
          password: 'Testing99!',
        } as User);
      },
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'test@example.com',
          password: 'Testing99!',
        } as User);
      },
      remove: (id: number) => {
        return Promise.resolve({
          id,
          email: 'test@example.com',
          password: 'Testing99!',
        } as User);
      },
      update: (id: number, data) => {
        return Promise.resolve({
          id,
          email: 'test@example.com',
          password: data.password,
        } as User);
      },
    };
    fakeAuthService = {
      signup: (email: string, password: string) => {
        return Promise.resolve({
          id: 99,
          email,
          password,
        } as User);
      },
      signIn: (email: string, password: string) => {
        return Promise.resolve({
          id: 99,
          email,
          password,
        } as User);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find all users', async () => {
    const users = await controller.findAll();

    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@example.com');
  });

  it('should find the user with the given id', async () => {
    const users = await controller.findOne('1');

    expect(users.id).toEqual(1);
  });

  it('Signing in should update session and return user', async () => {
    const session = { userId: 1 };
    const user = await controller.signIn(
      {
        email: 'test@example.com',
        password: 'Testing99!',
      },
      session,
    );

    expect(user.id).toEqual(99);
    expect(session.userId).toEqual(99);
  });
});
