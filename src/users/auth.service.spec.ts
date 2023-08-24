import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    fakeUsersService = {
      findByEmail: (email: string) => {
        const filteredUsers: User[] = users.filter(
          (user) => user.email === email,
        );

        return Promise.resolve(filteredUsers[0]);
      },

      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('Can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('Creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('test@test.com', 'Test123!');

    expect(user.password).not.toEqual('Test123!');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('Throws a BadRequest error if user signs up with an email already in use', async () => {
    await service.signup('test@example.com', 'TestPassword99!');

    await expect(
      service.signup('test@example.com', 'TestPassword99!'),
    ).rejects.toThrow(BadRequestException);
  });

  it('Throws a NotFound error if user tries to sign in with an invalid email', async () => {
    await expect(
      service.signIn('test@example.com', 'TestPassword99!'),
    ).rejects.toThrow(NotFoundException);
  });

  it('Throws a BadRequest error if user tries to sign in with an invalid password', async () => {
    await service.signup('test@example.com', 'TestPassword99!');

    await expect(
      service.signIn('test@example.com', 'TestPassword9!'),
    ).rejects.toThrow(BadRequestException);
  });

  it('Returns an user if the correct password is provided', async () => {
    await service.signup('test@example.com', 'TestPassword99!');

    const user = await service.signIn('test@example.com', 'TestPassword99!');

    expect(user).toBeDefined();
  });
});
