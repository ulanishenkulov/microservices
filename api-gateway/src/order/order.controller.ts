import { Controller, Get, Post,Param, UseGuards, Req, HttpException, HttpStatus, Body, Patch, Headers, BadRequestException } from '@nestjs/common';
import { OrderClient } from './order.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { OrderIdParamDto } from './dto/get-order-id.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/enums/user-role.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderPayloadDto } from './dto/create-order-payload.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderClient: OrderClient) {}

  @Post()
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(UserRole.USER)
  async create(@Req() req,@Headers('idempotency-key') key: string, @Body() createOrderDto: CreateOrderDto) {
      if (!key) {
        throw new BadRequestException('Idempotency-Key required');
      }
      const payload: CreateOrderPayloadDto = {
        ...createOrderDto,
        userId: req.user.userId,
      };
      return await this.orderClient.create(payload,key);
    } 

  @Get(':id')
  async get(@Param() params: OrderIdParamDto) {
    try {
      return this.orderClient.findById(params.id);
    } catch (err: any) {
    if (err.response?.data) {
      throw new HttpException(err.response.data, err.response.status);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }  
  }

  @Patch(':id')
  async markPaid(@Param() params: OrderIdParamDto) {
    try {
      return this.orderClient.markPaid(params.id);
    } catch (err: any) {
    if (err.response?.data) {
      throw new HttpException(err.response.data, err.response.status);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }  
  }
}

