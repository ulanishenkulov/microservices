import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { KafkaProducerService } from 'src/kafka/kafka-producer.service';
import { UserRegisteredEvent } from 'src/events/user-registered.event';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('User already exists');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.usersRepo.create({ email: dto.email, passwordHash });
    await this.usersRepo.save(user);

    const event: UserRegisteredEvent = {
    userId: user.id,
    email: user.email,
  };

    //отправляем событие в Kafka (не блокируем регистрацию)
    this.kafkaProducer.emitUserCreated(event).catch((err) => {
    console.error('Kafka emit error (users.registered):', err);
    });

    const token = this.jwtService.sign({ userId: user.id, email: user.email });
    return { token };
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ userId: user.id, email: user.email });
    return { token };
  }

  async validate(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return { userId: payload.userId, email: payload.email };
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

