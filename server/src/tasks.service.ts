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
      await this.client.set('tasks', JSON.stringify([]));
    }
  }

  async createTask(title: string) {
    const tasks = await this.getAllTasks();
    const newTask = {
        id: Date.now().toString(),
        title,
        status: 'todo'
    };
    const updatedTasks = [...tasks, newTask];
    await this.client.set('tasks', JSON.stringify(updatedTasks));
    return updatedTasks;
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

  async deleteTask(id: string) {
    const tasks = await this.getAllTasks();
    const updatedTasks = tasks.filter((t: any) => t.id !== id);
    
    await this.client.set('tasks', JSON.stringify(updatedTasks));
    return updatedTasks;
  }
}