import { ApiModelProperty } from '@nestjs/swagger';

export class TwitterListResponseDTO {
  @ApiModelProperty({
    type: String,
    description: 'Id of the list'
  })
  id: string;

  @ApiModelProperty({
    type: String,
    description: 'Name of the list'
  })
  name: string;

  @ApiModelProperty({
    type: String,
    description: 'Slug name of the list'
  })
  slug: string;

  @ApiModelProperty({
    type: String,
    description: 'Description of the list'
  })
  description: string;

  @ApiModelProperty({
    type: String,
    description: 'Uri of the list'
  })
  uri: string;

  @ApiModelProperty({
    type: Boolean,
    description: 'Value containing if the list is public or not'
  })
  isPublic: boolean;

  @ApiModelProperty({
    type: Object,
    isArray: true,
    description: 'Users in the list'
  })
  users: object[];

  @ApiModelProperty({
    type: String,
    description: 'Date when the list was created'
  })
  createdDate?: string;
}
