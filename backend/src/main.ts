import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

let cachedServer: any;

async function bootstrapServer() {
  if (cachedServer) return cachedServer;

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn'], // Reduce noise in serverless logs
  });
  
  app.setGlobalPrefix('api');

  // Skip static assets on Vercel as it's read-only
  if (!process.env.VERCEL) {
    try {
      app.useStaticAssets(join(__dirname, '..', 'uploads'), {
        prefix: '/api/uploads/',
      });
    } catch (e) {}
  }

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('Portfolio API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.init();
  cachedServer = app.getHttpAdapter().getInstance();
  return cachedServer;
}

// Vercel Entry Point
export default async (req: any, res: any) => {
  try {
    const server = await bootstrapServer();
    return server(req, res);
  } catch (err) {
    console.error('CRITICAL BOOTSTRAP ERROR:', err);
    res.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error during Bootstrap',
      error: err.message,
    });
  }
};

// Local execution support
if (!process.env.VERCEL && require.main === module) {
  async function startLocal() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.setGlobalPrefix('api');
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT') || 3000;
    await app.listen(port);
    console.log(`Local server running on http://localhost:${port}/api`);
  }
  startLocal();
}
