import {
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Body, Delete, Post } from '@nestjs/common';
import { UserQueryRepository } from '../infrastructure/query/user.query-repository';
import { UserQueryParams } from './input-dto/user.query-params.dto';
import { BasicAuthGuard } from '../guards/basic/basic-auth.guard';
import { RegistrationDto } from './input-dto/registration.dto';
import { IdInputDTO } from '../../../core/dto/id-params.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserForAdminCommand } from '../application/usecases/admin/create-user-for-admin.usecase';
import { DeleteUserForAdminCommand } from '../application/usecases/admin/delete-user-for-admin.usecase';

@Controller('users')
@UseGuards(BasicAuthGuard)
export class UserController {
  constructor(
    private readonly usersQueryRepository: UserQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}
  @Get()
  async findAll(@Query() query: UserQueryParams) {
    return await this.usersQueryRepository.findAll(query);
  }

  @Post()
  async create(@Body() createUserDto: RegistrationDto) {
    const { userId } = await this.commandBus.execute(
      new CreateUserForAdminCommand(createUserDto),
    );
    return await this.usersQueryRepository.findOne(userId);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param() { id }: IdInputDTO) {
    return await this.commandBus.execute(new DeleteUserForAdminCommand(id));
  }
}
