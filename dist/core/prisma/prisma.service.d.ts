import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from "@prisma/client";
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private loger;
    onModuleInit(): void;
    onModuleDestroy(): void;
}
