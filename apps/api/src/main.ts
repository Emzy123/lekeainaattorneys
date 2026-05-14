import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Basic configuration
  app.enableCors();
  
  // Using port 3002 to avoid conflicts with Next.js running on 3000/3001
  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`API Application is running on: http://localhost:${port}`);
}
bootstrap();
