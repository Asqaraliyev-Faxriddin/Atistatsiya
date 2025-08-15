import { Injectable } from '@nestjs/common';
import { Ctx, On, Start, Update } from 'nestjs-telegraf';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { Context, Markup } from 'telegraf';

@Update()
@Injectable()
export class BotService {
    private userProgress: Record<number, {
        userId: number,
        questions: any[],
        currentIndex: number,
        correct: number,
        wrong: number,
        bolimId: number,
        maxQuestions: number
    }> = {};

    constructor(private prisma: PrismaService) {}

    @Start()
    async start(@Ctx() ctx: Context) {
        await ctx.reply(
            `Assalomu alaykum, aziz ustozlar! 🌿🔬
Bu bot sizni 1-sinfdan 4-sinfgacha bo‘lgan tabiiy fanlar bo‘yicha attestatsiyaga tayyorlash uchun mo‘ljallangan. 📚✨`
        );

        await ctx.reply(
            "Iltimos, botdan foydalanish uchun\nQuyidagi contact yuborish tugmasini bosing",
            Markup.keyboard([Markup.button.contactRequest('📱 Contact yuborish')])
                .oneTime()
                .resize()
        );
    }

    @On("contact")
    async contact(@Ctx() ctx: Context) {
        if (!ctx.message || !("contact" in ctx.message)) {
            await ctx.reply(
                "Iltimos, Contact yuborish tugmasini bosing.",
                Markup.keyboard([Markup.button.contactRequest('📱 Contact yuborish')])
                    .oneTime()
                    .resize()
            );
            return;
        }

        const telegramId = ctx.chat!.id;
        const phone = ctx.message.contact.phone_number;

        // Foydalanuvchini tekshirish
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
        } else {
            await ctx.reply("Siz avval ro‘yxatdan o'tgansiz ✅");
        }

        await ctx.reply(
            "Qaysi sinf bo‘yicha test berilsin tanlang.",
            Markup.keyboard([['1-sinf', '2-sinf'], ['3-sinf', '4-sinf']])
                .oneTime()
                .resize()
        );
    }

    @On("message")
    async message(@Ctx() ctx: Context) {
        if (!ctx.message || !("text" in ctx.message)) return;
        
        const text = ctx.message.text;
        const chatId = ctx.chat!.id;

        // Agar foydalanuvchi sinfni tanlasa
        // @ts-ignore
        if (["1-sinf", "2-sinf", "3-sinf", "4-sinf"].includes(text)) {
            const bolimId = parseInt(text[0]);

            const user = await this.prisma.user.findUnique({
                where: { telegramId: BigInt(chatId) }
            });

            if (!user) {
                await ctx.reply(
                    "Avval ro‘yxatdan o‘ting 📱",
                    Markup.keyboard([Markup.button.contactRequest('📱 Contact yuborish')])
                        .oneTime()
                        .resize()
                );
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
            await ctx.reply(
                "Iltimos, avval sinfni tanlang.",
                Markup.keyboard([['1-sinf', '2-sinf'], ['3-sinf', '4-sinf']])
                    .oneTime()
                    .resize()
            );
            return;
        }

        // Agar savol soni kiritilsa
        if (progress.questions.length === 0 && !isNaN(parseInt(text))) {
            const maxQuestions = Math.min(parseInt(text), 1000);
            const allQuestions = await this.prisma.atistatsiya.findMany({
                where: { bolimId: progress.bolimId }
            });

            // Tasodifiy savollar aralashtirish
            const shuffled = allQuestions.sort(() => Math.random() - 0.5);

            progress.questions = shuffled.slice(0, maxQuestions);
            progress.maxQuestions = maxQuestions;

            await ctx.reply(`Siz ${progress.maxQuestions} ta savolga javob berasiz. Boshlaymiz!`);
            await this.sendQuestion(ctx, chatId);
            return;
        }

        // Agar "Testni to‘xtatish" tanlansa
        if (text === 'Testni to‘xtatish') {
            await ctx.reply(`Test tugadi!\n✅ To‘g‘ri javoblar: ${progress.correct}\n❌ Noto‘g‘ri javoblar: ${progress.wrong}`);
            delete this.userProgress[chatId];
            return;
        }

        const q = progress.questions[progress.currentIndex];
        const correctAnswerText = q[q.AnswerKey as 'A' | 'B' | 'C' | 'D'];

        const isCorrect = text === correctAnswerText;

        if (isCorrect) {
            progress.correct++;
            await ctx.reply("✅ To‘g‘ri javob!");
        } else {
            progress.wrong++;
            await ctx.reply(`❌ Noto‘g‘ri javob! To‘g‘ri javob: ${correctAnswerText}`);
        }

        // Javobni DB ga yozish
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
        } else {
            await ctx.reply(`Test tugadi!\n✅ To‘g‘ri javoblar: ${progress.correct}\n❌ Noto‘g‘ri javoblar: ${progress.wrong}`);
            delete this.userProgress[chatId];
        }
    }

    private async sendQuestion(ctx: Context, chatId: number) {
        const progress = this.userProgress[chatId];
        if (!progress) return;

        const q = progress.questions[progress.currentIndex];
        await ctx.reply(
            q.Text,
            Markup.keyboard([[q.A, q.B], [q.C, q.D], ['Testni to‘xtatish']]).resize()
        );
    }
}
