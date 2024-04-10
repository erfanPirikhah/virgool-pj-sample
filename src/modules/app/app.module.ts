import { Module } from '@nestjs/common';
import { CustomConfigModules } from '../config/configs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmDbConfig } from '../../config/typeorm.config';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:join(process.cwd(),'.env')
    }),
    CustomConfigModules,
    TypeOrmModule.forRootAsync({
      useClass:TypeOrmDbConfig,
      inject:[TypeOrmDbConfig]
    }),
    UserModule,
    AuthModule,
    JwtModule
  ],
  controllers: [],
  providers: [TypeOrmDbConfig],
})
export class AppModule {}
