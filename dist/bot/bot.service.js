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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const prisma_service_1 = require("../core/prisma/prisma.service");
const telegraf_1 = require("telegraf");
let BotService = class BotService {
    prisma;
    userProgress = {};
    constructor(prisma) {
        this.prisma = prisma;
    }
    async start(ctx) {
        await ctx.reply(`Assalomu alaykum, aziz ustozlar! 🌿🔬
Bu bot sizni 1-sinfdan 4-sinfgacha bo‘lgan tabiiy fanlar bo‘yicha attestatsiyaga tayyorlash uchun mo‘ljallangan. 📚✨`);
        await ctx.reply("Iltimos, botdan foydalanish uchun\nQuyidagi contact yuborish tugmasini bosing", telegraf_1.Markup.keyboard([telegraf_1.Markup.button.contactRequest('📱 Contact yuborish')])
            .oneTime()
            .resize());
    }
    async contact(ctx) {
        if (!ctx.message || !("contact" in ctx.message)) {
            await ctx.reply("Iltimos, Contact yuborish tugmasini bosing.", telegraf_1.Markup.keyboard([telegraf_1.Markup.button.contactRequest('📱 Contact yuborish')])
                .oneTime()
                .resize());
            return;
        }
        const telegramId = ctx.chat.id;
        const phone = ctx.message.contact.phone_number;
        let user = await this.prisma.user.findUnique({
            where: { telegramId: BigInt(telegramId) }
        });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    Fullname: ctx.message.contact.first_name,
                    Lastname: ctx.message.contact.last_name,
                    telegramId: BigInt(telegramId),
                    phone
                }
            });
            await ctx.reply("Tabriklaymiz! 🎉 Siz muvaffaqiyatli ro‘yxatdan o‘tdingiz.");
        }
        else {
            await ctx.reply("Siz avval ro‘yxatdan o'tgansiz ✅");
        }
        await ctx.reply("Qaysi sinf bo‘yicha test berilsin tanlang.", telegraf_1.Markup.keyboard([['1-sinf', '2-sinf'], ['3-sinf', '4-sinf']])
            .oneTime()
            .resize());
    }
    async message(ctx) {
        if (!ctx.message || !("text" in ctx.message))
            return;
        const text = ctx.message.text;
        const chatId = ctx.chat.id;
        if (["1-sinf", "2-sinf", "3-sinf", "4-sinf"].includes(text)) {
            const bolimId = parseInt(text[0]);
            const user = await this.prisma.user.findUnique({
                where: { telegramId: BigInt(chatId) }
            });
            if (!user) {
                await ctx.reply("Avval ro‘yxatdan o‘ting 📱", telegraf_1.Markup.keyboard([telegraf_1.Markup.button.contactRequest('📱 Contact yuborish')])
                    .oneTime()
                    .resize());
                return;
            }
            this.userProgress[chatId] = {
                userId: user.id,
                questions: [],
                currentIndex: 0,
                correct: 0,
                wrong: 0,
                bolimId,
                maxQuestions: 0
            };
            await ctx.reply(`Nechta savol berilsin? (masalan: 10)`);
            return;
        }
        const progress = this.userProgress[chatId];
        if (!progress) {
            await ctx.reply("Iltimos, avval sinfni tanlang.", telegraf_1.Markup.keyboard([['1-sinf', '2-sinf'], ['3-sinf', '4-sinf']])
                .oneTime()
                .resize());
            return;
        }
        if (progress.questions.length === 0 && !isNaN(parseInt(text))) {
            const maxQuestions = Math.min(parseInt(text), 1000);
            const allQuestions = await this.prisma.atistatsiya.findMany({
                where: { bolimId: progress.bolimId }
            });
            const shuffled = allQuestions.sort(() => Math.random() - 0.5);
            progress.questions = shuffled.slice(0, maxQuestions);
            progress.maxQuestions = maxQuestions;
            await ctx.reply(`Siz ${progress.maxQuestions} ta savolga javob berasiz. Boshlaymiz!`);
            await this.sendQuestion(ctx, chatId);
            return;
        }
        if (text === 'Testni to‘xtatish') {
            await ctx.reply(`Test tugadi!\n✅ To‘g‘ri javoblar: ${progress.correct}\n❌ Noto‘g‘ri javoblar: ${progress.wrong}`);
            delete this.userProgress[chatId];
            return;
        }
        const q = progress.questions[progress.currentIndex];
        const correctAnswerText = q[q.AnswerKey];
        const isCorrect = text === correctAnswerText;
        if (isCorrect) {
            progress.correct++;
            await ctx.reply("✅ To‘g‘ri javob!");
        }
        else {
            progress.wrong++;
            await ctx.reply(`❌ Noto‘g‘ri javob! To‘g‘ri javob: ${correctAnswerText}`);
        }
        await this.prisma.atistatsiyaAnswer.create({
            data: {
                userId: progress.userId,
                AnsCount: isCorrect ? 1 : 0,
                DisCount: isCorrect ? 0 : 1,
                BolimId: progress.bolimId
            }
        });
        progress.currentIndex++;
        if (progress.currentIndex < progress.questions.length) {
            await this.sendQuestion(ctx, chatId);
        }
        else {
            await ctx.reply(`Test tugadi!\n✅ To‘g‘ri javoblar: ${progress.correct}\n❌ Noto‘g‘ri javoblar: ${progress.wrong}`);
            delete this.userProgress[chatId];
        }
    }
    async sendQuestion(ctx, chatId) {
        const progress = this.userProgress[chatId];
        if (!progress)
            return;
        const q = progress.questions[progress.currentIndex];
        await ctx.reply(q.Text, telegraf_1.Markup.keyboard([[q.A, q.B], [q.C, q.D], ['Testni to‘xtatish']]).resize());
    }
};
exports.BotService = BotService;
__decorate([
    (0, nestjs_telegraf_1.Start)(),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], BotService.prototype, "start", null);
__decorate([
    (0, nestjs_telegraf_1.On)("contact"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], BotService.prototype, "contact", null);
__decorate([
    (0, nestjs_telegraf_1.On)("message"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], BotService.prototype, "message", null);
exports.BotService = BotService = __decorate([
    (0, nestjs_telegraf_1.Update)(),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BotService);
//# sourceMappingURL=bot.service.js.map