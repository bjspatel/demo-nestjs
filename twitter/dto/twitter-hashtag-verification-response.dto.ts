import { ApiModelProperty } from '@nestjs/swagger';

export class TwitterHashtagVerificationResponseDTO {
  @ApiModelProperty({
    type: String,
    description: 'Hashtag'
  })
  hashtag: string;

  @ApiModelProperty({
    type: Boolean,
    description: 'Value containing if the hashtah is valid or not'
  })
  isValid: boolean;
}
