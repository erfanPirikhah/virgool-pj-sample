import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { UserEntity } from '../user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OTPEntity } from '../user/entities/otp.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtService],
  imports:[UserModule,TypeOrmModule.forFeature([UserEntity,OTPEntity])]
})
export class AuthModule {}
