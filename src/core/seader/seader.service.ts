import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // sizning Prisma service joylashuvi
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SeaderService implements OnModuleInit {
  private readonly logger = new Logger(SeaderService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    try {
      await this.sinf1();
      await this.sinf2();
      await this.sinf3();
      await this.sinf4();
      this.logger.log('Barcha sinflar ma\'lumotlari qo\'shildi');
    } catch (error) {
      this.logger.error('Ma\'lumotlarni qo\'shishda xatolik:', error.message);
    }
  }

  private async readJson(filePath: string) {
    const fullPath = path.join(process.cwd(), filePath);
    const data = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(data);
  }

  async sinf1() {
    try {
      const questions = await this.readJson('./data/sinf1_tabiiy_fanlar_120.json');
      for (const q of questions) {
        await this.prisma.atistatsiya.create({
          data: {
            Text: q.Text,
            A: q.A,
            B: q.B,
            C: q.C,
            D: q.D,
            AnswerKey: q.AnswerKey,
            bolimId: 1,
          },
        });
      }
      this.logger.log('Sinf 1 savollar qo\'shildi');
    } catch (error) {
      this.logger.error('Sinf 1 savollarini qo\'shishda xatolik: ' + error.message);
    }
  }

  async sinf2() {
    try {
      const questions = await this.readJson('./data/2sinf_tabiiy_fanlar_120test.json');
      for (const q of questions) {
        await this.prisma.atistatsiya.create({
          data: {
            Text: q.Text,
            A: q.A,
            B: q.B,
            C: q.C,
            D: q.D,
            AnswerKey: q.AnswerKey,
            bolimId: 2,
          },
        });
      }
      this.logger.log('Sinf 2 savollar qo\'shildi');
    } catch (error) {
      this.logger.error('Sinf 2 savollarini qo\'shishda xatolik: ' + error.message);
    }
  }

  async sinf3() {
    try {
      const questions = await this.readJson('./data/3sinf_tabiiy_fanlar_120test.json');
      for (const q of questions) {
        await this.prisma.atistatsiya.create({
          data: {
            Text: q.Text,
            A: q.A,
            B: q.B,
            C: q.C,
            D: q.D,
            AnswerKey: q.AnswerKey,
            bolimId: 3,
          },
        });
      }
      this.logger.log('Sinf 3 savollar qo\'shildi');
    } catch (error) {
      this.logger.error('Sinf 3 savollarini qo\'shishda xatolik: ' + error.message);
    }
  }

  async sinf4() {
    try {
      const questions = await this.readJson('./data/tabiiy_fan_4sinf_120haqiqiy.json');
      for (const q of questions) {
        await this.prisma.atistatsiya.create({
          data: {
            Text: q.Text,
            A: q.A,
            B: q.B,
            C: q.C,
            D: q.D,
            AnswerKey: q.AnswerKey,
            bolimId: 4,
          },
        });
      }
      this.logger.log('Sinf 4 savollar qo\'shildi');
    } catch (error) {
      this.logger.error('Sinf 4 savollarini qo\'shishda xatolik: ' + error.message);
    }
  }
}
