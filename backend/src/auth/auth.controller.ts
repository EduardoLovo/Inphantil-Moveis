import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    UseGuards,
    Request,
    Get,
    Patch,
    Req,
    Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
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
import { UpdateUserDto } from './dto/update-user.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { Response } from 'express'; // <--- CORREÇÃO 1: Importe isso!

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    // --- MANTENHA OS MÉTODOS EXISTENTES ---

    @Public()
    @Post('register')
    @ApiOperation({ summary: 'Registrar um novo usuário (Retorna Token)' })
    @ApiResponse({
        status: 201,
        description: 'Usuário registrado e logado com sucesso',
    })
    @ApiResponse({ status: 409, description: 'Email já existe' })
    register(@Body() registerDto: RegisterDto, @Request() req: any) {
        return this.authService.register(registerDto, req);
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Realizar login e obter token JWT' })
    @ApiResponse({
        status: 200,
        description: 'Login bem-sucedido, retorna token de acesso',
    })
    @ApiResponse({ status: 401, description: 'Email ou senha inválidos' })
    login(@Body() loginDto: LoginDto, @Request() req: any) {
        return this.authService.login(loginDto, req);
    }

    // --- MÉTODOS DO GOOGLE (CORRIGIDOS) ---

    @Public() // Adicione @Public() para evitar bloqueio se tiver Guard Global
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req: any) {
        // O Guard inicia o fluxo e redireciona.
    }

    @Public() // Adicione @Public() aqui também
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    // CORREÇÃO 2: res: Response (do express)
    async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
        const { accessToken } = await this.authService.validateGoogleUser(
            req.user,
        );

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        return res.redirect(
            `${frontendUrl}/auth/callback?token=${accessToken}`,
        );
    }

    // --- DEMAIS MÉTODOS ---

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obter dados do perfil do usuário logado' })
    @ApiResponse({ status: 200, description: 'Dados do perfil' })
    @ApiResponse({
        status: 401,
        description: 'Não autorizado (token inválido)',
    })
    getProfile(@GetUser() user: User) {
        return user;
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('profile')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Atualizar dados do usuário logado' })
    updateProfile(@Request() req: any, @Body() dto: UpdateUserDto) {
        return this.authService.updateProfile(req.user.id, dto);
    }

    @Public()
    @Post('forgot-password')
    @ApiOperation({ summary: 'Solicitar recuperação de senha' })
    forgotPassword(@Body() dto: ForgotPasswordDto) {
        return this.authService.forgotPassword(dto.email);
    }

    @Public()
    @Post('reset-password')
    @ApiOperation({ summary: 'Redefinir senha usando o token' })
    resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto.token, dto.newPassword);
    }
}
