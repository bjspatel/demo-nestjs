import { BadRequestException, Injectable } from '@nestjs/common';
import { QueryOptions } from 'apollo-boost';
import {
  INTEGRATION_PLATFORMS,
  INTEGRATION_TYPES,
  TWITTER_KEYWORD_TYPES
} from '../../../../core/providers/app.constant.provider';
import { IntegrationApiService } from '../../../apis/api.service';
import { ApolloClientService } from '../../../../core/services/apollo-client.service';
import { TwitterTrackerService } from '../../../../trackers-data/services/twitter-tracker.service';
import { TwitterTransformService } from './helpers/twitter-transform.service';
import { TwitterApi } from '../../../apis/twitter.api';
import { GqlTemplates } from './helpers/gql-templates';
import { TwitterListResponseDTO } from '../dto/twitter-list-response.dto';
import { TwitterHashtagVerificationResponseDTO } from '../dto/twitter-hashtag-verification-response.dto';
import { TwitterUserVerificationResponseDTO } from '../dto/twitter-user-verification-response.dto';

@Injectable()
export class TwitterIntegrationService {
  private api: TwitterApi;
  constructor(
    private readonly apis: IntegrationApiService,
    private readonly apolloClient: ApolloClientService,
    private readonly twitterTrackerService: TwitterTrackerService,
    private readonly transformService: TwitterTransformService,
  ) {}

  async getLists(
    integrationId: string,
    userId: string
  ): Promise<TwitterListResponseDTO[]> {
    this.api = await this.apis.getApi<TwitterApi>(
      INTEGRATION_PLATFORMS.TWITTER,
      {
        type: INTEGRATION_TYPES.INGESTION,
        integrationId,
        userId
      }
    );

    const rawLists = await this.api.getLists();
    const getUsersPromises = rawLists.map(list => this.api.getListUsers(list.slug, list.user.screen_name));
    const rawUsers = await Promise.all(getUsersPromises);
    rawLists.forEach((list, index) => {
      list.users = rawUsers[index];
    });
    const lists = rawLists.map(list => this.transformService.toList(list));
    return lists;
  }

  async verifyUserHandles(
    integrationId: string,
    userId: string,
    handles: string[]
  ): Promise<TwitterUserVerificationResponseDTO[]> {
    const usedHandles = await this.twitterTrackerService.findByUserId(userId, TWITTER_KEYWORD_TYPES.HANDLE);

    const inputUsers = await this.getUsersFromHandles(integrationId, userId, handles);
    const inputUserVerifications = this.transformService.toVerifyUsers(handles, inputUsers);

    const newUserVerifications = inputUserVerifications.filter(userVerification => userVerification.exists);
    if(newUserVerifications.length > 0 && newUserVerifications.length + usedHandles.length > 25) {
      throw new BadRequestException('Cannot add more than 25 twitter new user handles');
    }
    return inputUserVerifications;
  }

  async getUsersFromHandles(
    integrationId: string,
    userId: string,
    handles: string[]
  ) {
    this.api = await this.apis.getApi<TwitterApi>(
      INTEGRATION_PLATFORMS.TWITTER,
      {
        type: INTEGRATION_TYPES.INGESTION,
        integrationId,
        userId
      }
    );

    const users = await this.api.getUsers(handles.join(','));
    const briefUsers = users.map(user => {
      return {
        id: user.id_str,
        name: user.name,
        handle: user.screen_name,
        description: user.description
      };
    });
    return briefUsers;
  }

  async verifyHashtags(
    authToken: string,
    userId: string,
    hashtags: string[]
  ): Promise<TwitterHashtagVerificationResponseDTO[]> {
    // find valid hashtags on the basis of format
    const validHashtags = [];
    const hashtagRegex = /^\w+$/;
    for(let hashtag of hashtags) {
      if (hashtag && hashtagRegex.test(hashtag)) {
        validHashtags.push(hashtag);
      }
    }

    // find valid hashtags on basis of blacklist
    const queryOptions: QueryOptions = {
      query: GqlTemplates.FIND_BLACKLISTED_WORDS,
      variables: { hashtags: validHashtags }
    }
    const { data: blacklistedResult } = await this.apolloClient.query(authToken, queryOptions);
    const blacklistedHashtags = blacklistedResult.insights_engagement_stop_words.map(
      result => result.stop_word);
    const allowedHashtags = validHashtags.filter(hashtag => !blacklistedHashtags.includes(hashtag));
    const hashtagVerifications = this.transformService.toVerifyHashtags(hashtags, allowedHashtags);
    const validHashtagVerifications = hashtagVerifications.filter(
      hashtagVerification => hashtagVerification.isValid);

    // find new hashtags
    const usedHashtags = await this.twitterTrackerService.findByUserId(userId, TWITTER_KEYWORD_TYPES.HASHTAG);
    const usedHashtagsKeywords = usedHashtags.map(hashtag => hashtag.keyword);
    const newHashtags = validHashtagVerifications.filter(
      hashtagVerification => usedHashtagsKeywords.includes(hashtagVerification.hashtag));

    // reject if asked to verify more than 25 new valid hashtags
    if(newHashtags.length > 0 && newHashtags.length > 25) {
      throw new BadRequestException('Cannot add more than 25 new twitter hashtags');
    }

    return hashtagVerifications;
  }

  async getAccount(
    integrationId: string,
    userId: string
  ) {
    this.api = await this.apis.getApi<TwitterApi>(
      INTEGRATION_PLATFORMS.TWITTER,
      {
        type: INTEGRATION_TYPES.INGESTION,
        integrationId,
        userId
      }
    );

    const account = await this.api.getAccount();
    return account;
  }
}
