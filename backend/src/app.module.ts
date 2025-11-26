import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/winston.config';

import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    // Winston logging
    WinstonModule.forRoot(winstonConfig),

    // Rate limit
    ThrottlerModule.forRoot({
      throttlers: [{ limit: 20, ttl: 60000 }],
    }),

    // Prometheus Metrics
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: { enabled: true },
    }),

    // ENV global
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Mongo
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('DB_URI'),

        connectionFactory: (connection) => {
          console.log('MongoDB connected:', connection.name);

          connection.on('error', (err) =>
            console.error('MongoDB error:', err),
          );
          connection.on('disconnected', () =>
            console.warn('MongoDB disconnected'),
          );

          return connection;
        },
      }),
    }),

    UserModule,
    AuthModule,
    ProductModule,
  ],

  controllers: [AppController],

  providers: [
    AppService,
    // GLOBAL Rate Limit Guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
