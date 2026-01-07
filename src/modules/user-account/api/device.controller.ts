import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { IdInputDTO } from 'src/core/dto/id-params.dto';
import { DeviceQueryRepository } from '../infrastructure/query/device.query-repository';
import ExtractUserFromRequest from '../guards/decorators/extract-user-from-req.decorators';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteDeviceCommand } from '../application/usecases/device/delete-device.usecase';
import { DeleteOtherDevicesCommand } from '../application/usecases/device/delete-other-devices.usecase';
import { JwtRefreshAuthGuard } from '../guards/cookie/jwt-refresh-auth.guard';
import RefreshTokenContextDto from '../guards/dto/refresh-token-context.dto';

@UseGuards(JwtRefreshAuthGuard)
@Controller('security/devices')
export class DeviceController {
  constructor(
    private readonly deviceQueryRepository: DeviceQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  findAll(@ExtractUserFromRequest() user: RefreshTokenContextDto) {
    return this.deviceQueryRepository.findAll(user.userId);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteOtherDevices(@ExtractUserFromRequest() user: RefreshTokenContextDto) {
    return this.commandBus.execute(new DeleteOtherDevicesCommand(user));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param() { id }: IdInputDTO,
    @ExtractUserFromRequest() user: RefreshTokenContextDto,
  ) {
    return this.commandBus.execute(new DeleteDeviceCommand(user, id));
  }
}
