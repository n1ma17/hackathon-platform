import { Module } from '@nestjs/common';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { auth } from './auth.js';
import { PrismaModule } from './lib/database/prisma.module.js';
import { ObserveModule, observeEnabled } from './observe.js';
import { UserModule } from './module/user/user.module.js';
import { HackathonModule } from './module/hackathon/hackathon.module.js';

@Module({
  imports: [
    PrismaModule,
    AuthModule.forRoot({ auth }),
    ...(observeEnabled
      ? [
          ObserveModule.forRoot({
            appKey: process.env.OBSERVE_APP_KEY!,
            appSecret: process.env.OBSERVE_APP_SECRET!,
            serviceId: process.env.OBSERVE_SERVICE_ID ?? 'hackathon-platform',
          }),
        ]
      : []),
    UserModule,
    HackathonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
