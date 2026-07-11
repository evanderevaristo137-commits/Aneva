import { IsIn, IsNotEmpty, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional() @IsString() @Length(2, 80)
  name?: string;

  @IsOptional() @IsString() @Length(9, 20)
  phone?: string;

  @IsOptional() @IsString() @Length(0, 500)
  bio?: string;

  @IsOptional() @IsUrl()
  avatarUrl?: string;

  @IsOptional() @IsIn(['pt', 'en', 'fr'])
  locale?: string;
}

export class SubmitIdentityDto {
  @IsIn(['BI', 'PASSAPORTE'])
  docType: string;

  @IsString() @IsNotEmpty()
  docNumber: string;

  @IsUrl()
  docPhotoUrl: string;

  @IsUrl()
  selfieUrl: string;
}
