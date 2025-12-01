import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactService {
    constructor(private prisma: PrismaService) {}

    async create(createContactDto: CreateContactDto, userId?: number) {
        return this.prisma.contactMessage.create({
            data: {
                ...createContactDto,
                userId: userId || null, // Salva o ID se existir, ou null
            },
        });
    }

    // NOVO MÉTODO: Listar todas as mensagens
    async findAll() {
        return this.prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' }, // Mais recentes primeiro
            include: {
                user: {
                    select: { id: true, name: true, email: true }, // Traz dados do usuário se estiver vinculado
                },
            },
        });
    }
}
