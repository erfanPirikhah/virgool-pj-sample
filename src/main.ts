import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerConfigInit } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerConfigInit(app)
  app.useGlobalPipes(new ValidationPipe())
  
  const {PORT} = process.env
  await app.listen(PORT,()=> {
    console.log(`http://localhost:${PORT}`)
    console.log(`swagger : http://localhost:${PORT}/swagger `)
  });

}
bootstrap();
