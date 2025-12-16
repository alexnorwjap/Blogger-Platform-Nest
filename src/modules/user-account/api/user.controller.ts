import {
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Body, Delete, Post } from '@nestjs/common';
import { UserService } from '../application/user.service';
import { UserQueryRepository } from '../infrastructure/query/user.query-repository';
import { UserQueryParams } from './input-dto/user.query-params.dto';
import { BasicAuthGuard } from '../guards/basic/basic-auth.guard';
import { RegistrationDto } from './input-dto/registration.dto';
import { IdInputDTO } from '../../../core/dto/id-params.dto';

@Controller('users')
@UseGuards(BasicAuthGuard)
export class UserController {
  constructor(
    private readonly usersService: UserService,
    private readonly usersQueryRepository: UserQueryRepository,
  ) {}
  @Get()
  async findAll(@Query() query: UserQueryParams) {
    console.log(query);
    return await this.usersQueryRepository.findAll(query);
  }

  @Post()
  async create(@Body() createUserDto: RegistrationDto) {
    const userId = await this.usersService.create(createUserDto);
    return await this.usersQueryRepository.findOne(userId);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param() { id }: IdInputDTO) {
    return await this.usersService.delete(id);
  }
}
