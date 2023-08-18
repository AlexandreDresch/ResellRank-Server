import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Session,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/who-are-user')
  @UseGuards(AuthGuard)
  whoAreUser(@CurrentUser() user: User) {
    return user;
  }

  @Post('/sign-out')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Post('/sign-up')
  async create(@Body() data: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(data.email, data.password);
    session.userId = user.id;

    return user;
  }

  @Post('/sign-in')
  async signIn(@Body() data: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signIn(data.email, data.password);
    session.userId = user.id;

    return user;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.usersService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
