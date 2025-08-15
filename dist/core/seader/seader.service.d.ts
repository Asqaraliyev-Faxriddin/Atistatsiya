import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
export declare class SeaderService implements OnModuleInit {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    private readJson;
    sinf1(): Promise<void>;
    sinf2(): Promise<void>;
    sinf3(): Promise<void>;
    sinf4(): Promise<void>;
}
