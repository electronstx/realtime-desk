import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class TasksService implements OnModuleInit {
  private client = createClient({ url: 'redis://localhost:6379' });

  async onModuleInit() {
    await this.client.connect();
    console.log('✅ Redis Storage Ready');
    
    const data = await this.client.get('tasks');
    if (!data) {
      const initialTasks = [
        { id: '1', title: 'Сделать чистую архитектуру', status: 'todo' },
        { id: '2', title: 'Настроить Redis', status: 'done' },
      ];
      await this.client.set('tasks', JSON.stringify(initialTasks));
    }
  }

  async getAllTasks() {
    const data = await this.client.get('tasks');
    return JSON.parse(data || '[]');
  }

  async updateTaskStatus(id: string, newStatus: string) {
    const tasks = await this.getAllTasks();
    const updatedTasks = tasks.map((t: any) => 
      t.id === id ? { ...t, status: newStatus } : t
    );
    await this.client.set('tasks', JSON.stringify(updatedTasks));
    return updatedTasks;
  }
}