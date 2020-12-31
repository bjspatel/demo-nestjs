import { ApiModelProperty } from '@nestjs/swagger';

export class TwitteUsertResponseDTO {
  @ApiModelProperty({
    type: String,
    description: 'Id of the user'
  })
  id: string;

  @ApiModelProperty({
    type: String,
    description: 'Name of the user'
  })
  name: string;

  @ApiModelProperty({
    type: String,
    description: 'Handle of the user'
  })
  handle: string;

  @ApiModelProperty({
    type: String,
    description: 'Description of the list'
  })
  description: string;

  @ApiModelProperty({
    type: String,
    description: 'Url of the user'
  })
  url: string;

  @ApiModelProperty({
    type: String,
    description: 'Url of the user'
  })
  avatarUrl: string;

  @ApiModelProperty({
    type: String,
    description: 'Date when the user was created'
  })
  createdDate?: string;
}
