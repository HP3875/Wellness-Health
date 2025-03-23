import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { AppointmentModule } from './appointment/appointment.module';
import { BlogsModule } from './blogs/blogs.module';

@Module({
  imports: [PrismaModule, AuthModule, PostsModule, AppointmentModule, BlogsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
