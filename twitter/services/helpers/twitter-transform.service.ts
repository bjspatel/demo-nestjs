import { Injectable } from '@nestjs/common';
import { TwitterListResponseDTO } from '../../dto/twitter-list-response.dto';
import { TwitterUserVerificationResponseDTO } from '../../dto/twitter-user-verification-response.dto';
import { TwitteUsertResponseDTO } from '../../dto/twitter-user.response.dto';
import { TwitterHashtagVerificationResponseDTO } from '../../dto/twitter-hashtag-verification-response.dto';

@Injectable()
export class TwitterTransformService {
  public constructor() {}

  toList(list): TwitterListResponseDTO {
    const listResponse: TwitterListResponseDTO = {
      id: list.id_str,
      name: list.name,
      uri: list.uri,
      slug: list.slug,
      isPublic: list.mode === 'public',
      description: list.description,
      users: (list.users || []).map(this.toUser),
      createdDate: list.created_at
    };
    return listResponse;
  }

  toVerifyUsers(userHandles: string[], users: any[]): TwitterUserVerificationResponseDTO[] {
    const verifyResponse = userHandles.map(handle => {
      const user = users.find(user => user.handle === handle);
      return {
        handle,
        exists: !!user
      };
    });
    return verifyResponse;
  }

  toVerifyHashtags(hashtags: string[], validHashtags: any[]): TwitterHashtagVerificationResponseDTO[] {
    const verifyResponse = hashtags.map(hashtag => {
      return {
        hashtag,
        isValid: validHashtags.includes(hashtag)
      };
    });
    return verifyResponse;
  }

  toUser(rawUser) {
    const userResponse: TwitteUsertResponseDTO = {
      id: rawUser.id_str,
      name: rawUser.name,
      handle: rawUser.screen_name,
      url: rawUser.url,
      description: rawUser.description,
      avatarUrl: rawUser.profile_image_url,
      createdDate: rawUser.created_at
    };
    return userResponse;
  }
}
