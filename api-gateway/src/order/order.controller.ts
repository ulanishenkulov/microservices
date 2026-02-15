import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Req,
  Body,
  Patch,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

import { OrderClient } from './order.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/enums/user-role.enum';

import { OrderIdParamDto } from './dto/get-order-id.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order.response.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderClient: OrderClient) {}

  @Post()
  @ApiOperation({ summary: 'Create order' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Order created',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  async create(
    @Req() req,
    @Headers('idempotency-key') key: string,
    @Headers('x-request-id') requestId: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    if (!key) {
      throw new BadRequestException('Idempotency-Key required');
    }

    return this.orderClient.create(
      {
        ...createOrderDto,
        userId: req.user.userId,
      },
      key,
      requestId
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Order found',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async get(@Param() params: OrderIdParamDto) {
    return this.orderClient.findById(params.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mark order as paid' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Order marked as paid',
    type: OrderResponseDto,
  })
  async markPaid(@Param() params: OrderIdParamDto) {
    return this.orderClient.markPaid(params.id);
  }
}
