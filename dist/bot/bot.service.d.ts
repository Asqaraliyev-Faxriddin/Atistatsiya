import { PrismaService } from 'src/core/prisma/prisma.service';
import { Context } from 'telegraf';
export declare class BotService {
    private prisma;
    private userProgress;
    constructor(prisma: PrismaService);
    start(ctx: Context): Promise<void>;
    contact(ctx: Context): Promise<void>;
    message(ctx: Context): Promise<void>;
    private sendQuestion;
}
