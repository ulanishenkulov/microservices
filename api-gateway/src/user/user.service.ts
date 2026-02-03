import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class UserClient {
  private readonly userUrl: string;
  constructor( private readonly configService: ConfigService) {
    this.userUrl = this.configService.getOrThrow<string>('USER_SERVICE_URL');
  }

  async findAll() {
    const res = await axios.get(`${this.userUrl}`);
    return res.data;
  }

  async findOne(id: string)  {
    const res = await axios.get(`${this.userUrl}/${id}`);
    return res.data;
  }

  async remove(id: string) {
    const res = await axios.delete(`${this.userUrl}/${id}`);
    return res.data;
  }

    async topUp(dto: {userId: string, amount: number}) {
    const res = await axios.patch(`${this.userUrl}/${dto.userId}`,dto);
    return res.data;
  }
}
