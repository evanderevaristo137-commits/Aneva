import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, Length, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString() @IsNotEmpty() @Length(2, 80)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional() @IsString() @Length(9, 20)
  phone?: string;

  @IsString() @MinLength(8)
  password: string;

  /** Papel inicial: hóspede ou anfitrião. */
  @IsOptional() @IsIn(['GUEST', 'HOST'])
  role?: 'GUEST' | 'HOST';
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString() @IsNotEmpty()
  password: string;
}

export class RefreshDto {
  @IsString() @IsNotEmpty()
  refreshToken: string;
}

export class TwoFactorDto {
  @IsString() @Length(6, 6)
  code: string;

  /** Token temporário emitido no login quando o 2FA está ativo. */
  @IsString() @IsNotEmpty()
  challengeToken: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsString() @IsNotEmpty()
  token: string;

  @IsString() @MinLength(8)
  password: string;
}
