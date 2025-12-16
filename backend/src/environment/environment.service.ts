import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';

@Injectable()
export class EnvironmentService {
    constructor(private prisma: PrismaService) {}

    // 1. Criar Ambiente
    async create(data: CreateEnvironmentDto) {
        const { images, ...rest } = data;
        return this.prisma.environment.create({
            data: {
                ...rest,
                images: {
                    // Cria as imagens relacionadas automaticamente
                    create: images.map((url) => ({ url })),
                },
            },
            include: {
                images: true,
            },
        });
    }

    // 2. Listar Todos
    async findAll() {
        return this.prisma.environment.findMany({
            include: {
                images: true, // Traz as imagens da galeria junto
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    // 3. Buscar Um (Pelo ID)
    async findOne(id: number) {
        const environment = await this.prisma.environment.findUnique({
            where: { id },
            include: {
                images: true,
            },
        });

        if (!environment) {
            throw new NotFoundException(
                `Environment com ID ${id} não encontrado.`,
            );
        }

        return environment;
    }

    // 4. Atualizar
    async update(id: number, data: UpdateEnvironmentDto) {
        // Verifica se existe antes de tentar atualizar
        await this.findOne(id);

        const { images, ...rest } = data;

        return this.prisma.environment.update({
            where: { id },
            data: {
                ...rest, // Atualiza titulo e capa se vierem

                // Se o array de imagens foi enviado (mesmo que vazio), atualiza a galeria
                ...(images && {
                    images: {
                        // Estratégia: Limpa as imagens antigas desse ambiente e insere as novas
                        deleteMany: {},
                        create: images.map((url) => ({ url })),
                    },
                }),
            },
            include: {
                images: true, // Retorna o objeto atualizado com as novas imagens
            },
        });
    }

    // 5. Remover
    async remove(id: number) {
        // Verifica se existe
        await this.findOne(id);

        return this.prisma.environment.delete({
            where: { id },
            // Graças ao onDelete: Cascade no Schema, as imagens somem sozinhas
        });
    }
}
