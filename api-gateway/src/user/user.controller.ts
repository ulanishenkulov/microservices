import { Controller, Get, Param, UseGuards, Delete, Patch, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UserClient } from './user.service';
import { UserIdParamDto } from './dto/get-user-id.dto';
import { TopUpUserDto } from './dto/top-up-user.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { DeleteUserResponseDto } from './dto/delete-user.response.dto';
import { TopUpUserResponseDto } from './dto/topup-user.response.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/enums/user-role.enum';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userClient: UserClient) {}

  @Get('')
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiResponse({ status: 200, type: [UserResponseDto] })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll() {
    return this.userClient.findAll();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param() dto: UserIdParamDto) {
    return this.userClient.findOne(dto.id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete user (admin only)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: DeleteUserResponseDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteOne(@Param() dto: UserIdParamDto) {
    await this.userClient.remove(dto.id);
    return { message: `user with ${dto.id} is deleted` };
  }

  @Patch('/:id/topup')
  @ApiOperation({ summary: 'Top up user balance' })
  @ApiResponse({ status: 200, type: TopUpUserResponseDto })
  async topUpUser(@Param('id') userId: string, @Body() body: { amount: number }) {
    const result = await this.userClient.topUp({ userId, amount: body.amount });
    return { newBalance: result };
  }
}

