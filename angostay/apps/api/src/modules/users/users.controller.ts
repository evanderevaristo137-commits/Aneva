import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthUser, CurrentUser } from '../../common/decorators/current-user.decorator';
import { SubmitIdentityDto, UpdateProfileDto } from './dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  me(@CurrentUser() user: AuthUser) {
    return this.users.me(user.id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updateMe(@CurrentUser() user: AuthUser, @Body() dto: UpdateProfileDto) {
    return this.users.updateMe(user.id, dto);
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  deleteMe(@CurrentUser() user: AuthUser) {
    return this.users.deleteMe(user.id);
  }

  @Get('me/export')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  exportMyData(@CurrentUser() user: AuthUser) {
    return this.users.exportMyData(user.id);
  }

  @Post('me/identity-verification')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  submitIdentity(@CurrentUser() user: AuthUser, @Body() dto: SubmitIdentityDto) {
    return this.users.submitIdentity(user.id, dto);
  }

  @Get(':id/public')
  publicProfile(@Param('id') id: string) {
    return this.users.publicProfile(id);
  }
}
