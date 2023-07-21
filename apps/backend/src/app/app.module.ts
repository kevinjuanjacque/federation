import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FacturasModule } from '../facturas/facturas.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    AuthModule,
    FacturasModule,
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        port: 587,
        auth: {
          user:process.env.EMAIL,
          pass:process.env.PASSWORD_EMAIL
        },
      },
     
    }),
    MongooseModule.forRoot(process.env.URI_MONGO),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'assets')
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
