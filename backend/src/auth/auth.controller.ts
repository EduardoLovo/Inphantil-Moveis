import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    UseGuards,
    Request, // Importado de @nestjs/common
    Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
// 1. Importe os decorators do Swagger
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from './decorators/get-user.decorator';
import { Public } from './decorators/public.decorator';

@ApiTags('auth') // 2. Agrupa os endpoints sob a tag 'auth' (que definimos no main.ts)
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
   
    @Public()
    @Post('register')
    @ApiOperation({ summary: 'Registrar um novo usuário (Retorna Token)' }) // 3. Descreve o endpoint
    @ApiResponse({
        status: 201,
        description: 'Usuário registrado e logado com sucesso',
    })
    @ApiResponse({ status: 409, description: 'Email já existe' })
    // CORRIGIDO: Injeta o Request e passa para o service
    register(@Body() registerDto: RegisterDto, @Request() req: any) {
        return this.authService.register(registerDto, req);
    }

    
    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Realizar login e obter token JWT' }) // 4. Descreve
    @ApiResponse({
        status: 200,
        description: 'Login bem-sucedido, retorna token de acesso',
    })
    @ApiResponse({ status: 401, description: 'Email ou senha inválidos' })
    // CORRIGIDO: Injeta o Request e passa para o service
    login(@Body() loginDto: LoginDto, @Request() req: any) {
        return this.authService.login(loginDto, req);
    }

    // Vamos documentar também a rota de perfil que usamos como exemplo
    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    @ApiBearerAuth() // 5. Indica que esta rota precisa de um token "Bearer"
    @ApiOperation({ summary: 'Obter dados do perfil do usuário logado' })
    @ApiResponse({ status: 200, description: 'Dados do perfil' })
    @ApiResponse({
        status: 401,
        description: 'Não autorizado (token inválido)',
    })
    getProfile(@GetUser() user: User) {
        return user;
    }
}
