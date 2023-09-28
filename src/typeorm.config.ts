import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './users/entities/user.entity';
import { Report } from './reports/entities/report.entity';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: +configService.get<number>('POSTGRES_PORT', 5432),
  username: configService.get('POSTGRES_USERNAME'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DATABASE'),
  entities: [User, Report],
  synchronize: configService.get<string>('NODE_ENV') === 'dev',
  dropSchema: configService.get<string>('NODE_ENV') === 'test',
});
