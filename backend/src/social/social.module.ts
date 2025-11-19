import { Module } from '@nestjs/common';
import { SocialService } from './social.service';
import { SocialController } from './social.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        HttpModule, // 2. Adicione-o aqui para fornecer o HttpService
    ],
    providers: [SocialService],
    controllers: [SocialController],
    exports: [SocialService],
})
export class SocialModule {}
