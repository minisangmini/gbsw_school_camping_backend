import { Module } from '@nestjs/common';
import { ConfigModule } from './modules/config/config.module';
import { AdminModule } from './modules/admin/admin.module';
import { CampingModule } from './modules/camping/camping.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { CalendarModule } from './modules/calendar/calendar.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get<string>('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_SCHEMA'),
          entities: [join(__dirname, '/modules/**/entities/*.entity{.ts,.js}')],
          synchronize: true
        };
      },
    }),
    AuthModule,
    CampingModule,
    AdminModule,
    ConfigModule,
    CalendarModule,
  ],
})
export class AppModule { }
