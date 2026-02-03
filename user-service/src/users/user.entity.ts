import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { UserRole } from './enums/user.enums';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column()
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;
}
