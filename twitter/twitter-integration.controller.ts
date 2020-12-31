import {
  ApiResponse,
  ApiOperation,
  ApiUseTags,
  ApiBearerAuth
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Headers,
  Query
} from '@nestjs/common';
import { TwitterIntegrationService } from './services/twitter-integration.service';
import { TwitterListResponseDTO } from './dto/twitter-list-response.dto';
import { UserId } from '../../../../decorators/decorators';
import { TwitterUserVerificationResponseDTO } from './dto/twitter-user-verification-response.dto';
import { TwitterHashtagVerificationResponseDTO } from './dto/twitter-hashtag-verification-response.dto';

@ApiBearerAuth()
@ApiUseTags('integrations')
@Controller('integrations/twitter')
export class TwitterIntegrationController {
  constructor(
    private readonly twitterService: TwitterIntegrationService
  ) {}

  @Get('lists')
  @ApiOperation({
    title: 'Gets Lists',
    description: 'Gets twitter user lists'
  })
  @ApiResponse({
    status: 200,
    type: TwitterListResponseDTO,
    isArray: true
  })
  async getLists(
    @UserId() userId: string,
    @Query('integrationId') integrationId: string
  ) {
    return this.twitterService.getLists(integrationId, userId);
  }

  @Get('verify-handles')
  @ApiOperation({
    title: 'Verifies user handles',
    description: 'Verifies user handles'
  })
  @ApiResponse({
    status: 200,
    type: TwitterUserVerificationResponseDTO,
    isArray: true
  })
  async verifyUserHandles(
    @UserId() userId: string,
    @Query('integrationId') integrationId: string,
    @Query('handles') handles: string[]
  ) {
    return this.twitterService.verifyUserHandles(integrationId, userId, handles);
  }

  @Get('verify-hashtags')
  @ApiOperation({
    title: 'Verifies hashtags',
    description: 'Verifies hashtags'
  })
  @ApiResponse({
    status: 200,
    type: TwitterHashtagVerificationResponseDTO,
    isArray: true
  })
  async verifyHashtags(
    @Headers('authorization') authorization: string,
    @UserId() userId: string,
    @Query('hashtags') hashtags: string[]
  ) {
    return this.twitterService.verifyHashtags(authorization, userId, hashtags);
  }
}
