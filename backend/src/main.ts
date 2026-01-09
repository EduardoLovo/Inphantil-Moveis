import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // 1. Importe o ValidationPipe
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // 2. Crie a configuração do Swagger
    const config = new DocumentBuilder()
        .setTitle('Inphantil Móveis API')
        .setDescription('Documentação da API para o sistema Inphantil Móveis')
        .setVersion('1.0')
        .addTag('auth', 'Operações de Autenticação') // Adiciona uma "tag" para agrupar
        .addTag('users', 'Operações de Usuários') // Exemplo de outra tag
        .addBearerAuth() // 3. Habilita o "cadeado" para autenticação JWT
        .build();

    // 4. Crie o documento
    const document = SwaggerModule.createDocument(app, config);

    // 5. Configure a rota da UI do Swagger
    // (Ex: http://localhost:3000/api)
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT ?? 3000);
    if (process.env.NODE_ENV !== 'production') {
        console.log('Api em produção');
    } else {
        console.log(`Server running on http://localhost:3000`);
    }
}
bootstrap();
