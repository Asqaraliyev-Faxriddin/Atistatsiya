"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SeaderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeaderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const fs = require("fs");
const path = require("path");
let SeaderService = SeaderService_1 = class SeaderService {
    prisma;
    logger = new common_1.Logger(SeaderService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onModuleInit() {
        try {
            await this.sinf1();
            await this.sinf2();
            await this.sinf3();
            await this.sinf4();
            this.logger.log('Barcha sinflar ma\'lumotlari qo\'shildi');
        }
        catch (error) {
            this.logger.error('Ma\'lumotlarni qo\'shishda xatolik:', error.message);
        }
    }
    async readJson(filePath) {
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
        }
        catch (error) {
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
        }
        catch (error) {
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
        }
        catch (error) {
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
        }
        catch (error) {
            this.logger.error('Sinf 4 savollarini qo\'shishda xatolik: ' + error.message);
        }
    }
};
exports.SeaderService = SeaderService;
exports.SeaderService = SeaderService = SeaderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SeaderService);
//# sourceMappingURL=seader.service.js.map