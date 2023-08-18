import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}
  create(email: string, password: string) {
    const user = this.repository.create({ email, password });

    return this.repository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.repository.find();
  }

  findOne(id: number): Promise<User> {
    if (!id) {
      throw new NotFoundException('User not found.');
    }

    return this.repository.findOneBy({ id: id });
  }

  findByEmail(email: string): Promise<User> {
    return this.repository.findOneBy({ email: email });
  }

  async update(id: number, attrs: Partial<User>): Promise<User> {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException(`User ${id} not found.`);
    }
    Object.assign(user, attrs);

    return this.repository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return this.repository.remove(user);
  }
}
