import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TasksService } from './tasks.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway {
    @WebSocketServer() server: Server;

    constructor(private tasksService: TasksService) {}

    async handleConnection(client: any) {
        const tasks = await this.tasksService.getAllTasks();
        client.emit('task:updated', tasks);
    }

    @SubscribeMessage('task:move')
    async handleMove(@MessageBody() data: { id: string, status: string }) {
        const updatedTasks = await this.tasksService.updateTaskStatus(data.id, data.status);
        this.server.emit('task:updated', updatedTasks);
    }
}