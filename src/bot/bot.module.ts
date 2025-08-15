import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotService } from './bot.service';
import { SeaderService } from 'src/core/seader/seader.service';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: process.env.BOT_TOKEN as string,  
    }),
  ],
  providers: [BotService,SeaderService],
})
export class BotModule {}
