import { Controller, Get } from '@nestjs/common';
import { SocialService } from './social.service';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('social')
@Controller('social')
export class SocialController {
    constructor(private readonly socialService: SocialService) {}

    @Get('instagram-feed')
    @ApiOperation({ summary: 'Busca o feed do Instagram (Endpoint público)' })
    @ApiResponse({ status: 200, description: 'Lista de posts do Instagram.' })
    // NÃO PRECISA DE @UseGuards, é um endpoint público e não-sensível
    getFeed() {
        return this.socialService.getInstagramFeed();
    }
}
