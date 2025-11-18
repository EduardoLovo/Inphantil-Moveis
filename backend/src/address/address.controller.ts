import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    ParseIntPipe,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '@prisma/client';

@ApiTags('addresses')
@Controller('addresses')
@UseGuards(AuthGuard('jwt')) // Protege TODAS as rotas (precisa estar logado)
@ApiBearerAuth()
export class AddressController {
    constructor(private readonly addressService: AddressService) {}

    @Post()
    @ApiOperation({ summary: 'Cadastrar novo endereço' })
    @ApiResponse({ status: 201, description: 'Endereço criado.' })
    create(@GetUser() user: User, @Body() createAddressDto: CreateAddressDto) {
        return this.addressService.create(user.id, createAddressDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar meus endereços' })
    findAll(@GetUser() user: User) {
        return this.addressService.findAll(user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar um endereço específico' })
    findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
        return this.addressService.findOne(id, user.id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar um endereço' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
        @Body() updateAddressDto: UpdateAddressDto,
    ) {
        return this.addressService.update(id, user.id, updateAddressDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Excluir um endereço' })
    remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
        return this.addressService.remove(id, user.id);
    }
}
