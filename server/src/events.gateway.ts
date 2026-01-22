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

    @SubscribeMessage('task:create')
    async handleCreate(@MessageBody() data: { title: string }) {
        const updatedTasks = await this.tasksService.createTask(data.title);
        this.server.emit('task:updated', updatedTasks);
    }

    @SubscribeMessage('task:move')
    async handleMove(@MessageBody() data: { id: string, status: string }) {
        const updatedTasks = await this.tasksService.updateTaskStatus(data.id, data.status);
        this.server.emit('task:updated', updatedTasks);
    }

    @SubscribeMessage('task:delete')
    async handleDelete(@MessageBody() data: { id: string }) {
        const updatedTasks = await this.tasksService.deleteTask(data.id);
        this.server.emit('task:updated', updatedTasks);
    }
}