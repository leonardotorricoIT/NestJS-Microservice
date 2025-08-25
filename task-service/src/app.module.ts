import { Module } from '@nestjs/common';
import { TaskModule } from './tasks/tasks.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './database/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: '.env',
    }),
    DatabaseModule,
    TaskModule,
  ],
})
export class AppModule {}
