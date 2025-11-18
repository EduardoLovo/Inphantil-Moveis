import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
    constructor(private prisma: PrismaService) {}

    // Utilitário: Desmarca outros endereços padrão do usuário
    private async unsetOtherDefaults(userId: number) {
        await this.prisma.address.updateMany({
            where: { userId, isDefault: true },
            data: { isDefault: false },
        });
    }

    // 1. Criar Endereço (Vinculado ao User Logado)
    async create(userId: number, dto: CreateAddressDto) {
        // Se este for ser o padrão, desmarca os outros
        if (dto.isDefault) {
            await this.unsetOtherDefaults(userId);
        }

        return this.prisma.address.create({
            data: {
                ...dto,
                userId, // Vincula automaticamente
            },
        });
    }

    // 2. Listar Todos (Apenas do User Logado)
    async findAll(userId: number) {
        return this.prisma.address.findMany({
            where: { userId },
            orderBy: { isDefault: 'desc' }, // Padrão aparece primeiro
        });
    }

    // 3. Buscar Um (Verifica se pertence ao User)
    async findOne(id: number, userId: number) {
        const address = await this.prisma.address.findUnique({
            where: { id },
        });

        if (!address) {
            throw new NotFoundException(
                `Endereço com ID ${id} não encontrado.`,
            );
        }

        // Segurança: Bloqueia se tentar acessar endereço de outro usuário
        if (address.userId !== userId) {
            throw new ForbiddenException(
                'Você não tem permissão para acessar este endereço.',
            );
        }

        return address;
    }

    // 4. Atualizar
    async update(id: number, userId: number, dto: UpdateAddressDto) {
        await this.findOne(id, userId); // Garante existência e posse

        if (dto.isDefault) {
            await this.unsetOtherDefaults(userId);
        }

        return this.prisma.address.update({
            where: { id },
            data: dto,
        });
    }

    // 5. Deletar
    async remove(id: number, userId: number) {
        await this.findOne(id, userId); // Garante existência e posse

        return this.prisma.address.delete({
            where: { id },
        });
    }
}
