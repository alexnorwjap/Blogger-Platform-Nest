import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import { Body, Delete, Post } from '@nestjs/common';
import type { CreateUserDto } from '../dto/create-user.dto';
import { UserService } from '../application/user.service';
import { UserQueryRepository } from '../infrastructure/query/user.query-repository';
import { UserQueryParams } from './input-dto/user.query-params.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly usersService: UserService,
    private readonly usersQueryRepository: UserQueryRepository,
  ) {}
  @Get()
  async findAll(@Query() query: UserQueryParams) {
    return await this.usersQueryRepository.findAll(query);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const userId = await this.usersService.create(createUserDto);
    return await this.usersQueryRepository.findOne(userId);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    return await this.usersService.delete(id);
  }
}
