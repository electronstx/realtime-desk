import { io, Socket } from "socket.io-client";
import { writable } from "svelte/store";
import type { Task } from "./types";

export let socket: Socket;

export const tasks = writable<Task[]>([]);

export const initSocket = () => {
    if (socket?.connected) return;

    socket = io('http://localhost:3000');

    socket.on('connect', () => console.log('Connected to NestJS'));
    socket.on('task:updated', (data) => {
        console.log('Данные получены с сервера:', data);
        tasks.set(data);
    });
}