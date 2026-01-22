import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const pubClient = createClient({ url: 'redis://localhost:6379' });
  const subClient = pubClient.duplicate();

  await Promise.all([pubClient.connect(), subClient.connect()]);

  const redisAdapter = new IoAdapter(app);
  (redisAdapter as any).createIOServer = (port: number, options?: any) => {
    const server = (redisAdapter as any).constructor.prototype.createIOServer.call(redisAdapter, port, options);
    server.adapter(createAdapter(pubClient, subClient));
    return server;
  };

  app.useWebSocketAdapter(redisAdapter);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server & Redis Adapter are running on port ${port}`);
}
bootstrap();
