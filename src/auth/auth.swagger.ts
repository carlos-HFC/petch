import { ApiProperty } from '@nestjs/swagger';

export class Login {
  @ApiProperty({ type: 'string' })
  email: string;

  @ApiProperty({ type: 'string' })
  password: string;
}

export class GoogleLogin {
  @ApiProperty({ type: 'string' })
  email: string;

  @ApiProperty({ type: 'string' })
  googleId: string;

  @ApiProperty({ type: 'string', required: false })
  name: string;

  @ApiProperty({ type: 'string', required: false })
  avatar: string;
}

export class ResetPassword extends Login {
  @ApiProperty({ type: 'string' })
  token: string;

  @ApiProperty({ type: 'string' })
  confirmPassword: string;
}