import { Module } from '@nestjs/common';
import { LoggerModule } from '@Logger';
import { KakaoChatbotSkillModule } from '@kakaoChatbotSkill';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [LoggerModule, KakaoChatbotSkillModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
