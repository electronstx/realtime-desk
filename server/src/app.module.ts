import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { TasksService } from './tasks.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  providers: [EventsGateway, TasksService],
})
export class AppModule {}
