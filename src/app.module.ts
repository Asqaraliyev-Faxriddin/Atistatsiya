import { Module } from '@nestjs/common';
import { PrismaModule } from './core/prisma/prisma.module';
import { BotModule } from './bot/bot.module';
import { SeaderService } from './core/seader/seader.service';

@Module({
  imports: [PrismaModule, BotModule],
  providers: [SeaderService],
})
export class AppModule {}
