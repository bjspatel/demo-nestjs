import { ApiModelProperty } from '@nestjs/swagger';

export class TwitterUserVerificationResponseDTO {
  @ApiModelProperty({
    type: String,
    description: 'Handle of the user'
  })
  handle: string;

  @ApiModelProperty({
    type: Boolean,
    description: 'Value containing if the user exists or not'
  })
  exists: boolean;
}
