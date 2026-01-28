import { Controller, Post, Body, HttpException, HttpStatus, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { UserClient } from './user.service';
import { UserIdParamDto } from './dto/get-user-id.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserRole } from 'src/enums/user-role.enum';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userClient: UserClient) {}

  @Get('')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll() {
    try {
      return await this.userClient.findAll();
    } catch (err: any) {
      if (err.response?.data) {
        throw new HttpException(err.response.data, err.response.status);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/:id')
  async findOne(@Param() dto: UserIdParamDto) {
    try {
      return await this.userClient.findOne(dto.id);
    } catch (err: any) {
      if (err.response?.data) {
        throw new HttpException(err.response.data, err.response.status);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

    @Delete('/:id')
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(UserRole.ADMIN)
    async deleteOne(@Param() dto: UserIdParamDto) {
      try {
        await this.userClient.remove(dto.id);
        return {
          message: `user with ${dto.id} is deleted`
        }
      } catch (err: any) {
        if (err.response?.data) {
          throw new HttpException(err.response.data, err.response.status);
        }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
