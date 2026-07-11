import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { PropertyStatus, ReportStatus, UserStatus, VerificationStatus } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthUser, CurrentUser } from '../../common/decorators/current-user.decorator';
import { PaginationQuery } from '../../common/pagination';
import { AdminService } from './admin.service';

class ListUsersQuery extends PaginationQuery {
  @IsOptional() @IsEnum(UserStatus) status?: UserStatus;
  @IsOptional() @IsString() search?: string;
}
class SetUserStatusDto {
  @IsEnum(UserStatus) status: UserStatus;
}
class ReviewIdentityDto {
  @IsEnum(VerificationStatus) status: VerificationStatus;
  @IsOptional() @IsString() @Length(0, 500) notes?: string;
}
class ListPropertiesQuery extends PaginationQuery {
  @IsOptional() @IsEnum(PropertyStatus) status?: PropertyStatus;
}
class ModeratePropertyDto {
  @IsEnum(PropertyStatus) status: PropertyStatus;
  @IsOptional() verified?: boolean;
}
class ListReportsQuery extends PaginationQuery {
  @IsOptional() @IsEnum(ReportStatus) status?: ReportStatus;
}
class ResolveReportDto {
  @IsEnum(ReportStatus) status: ReportStatus;
  @IsOptional() @IsString() @Length(0, 1000) resolution?: string;
}
class ListAuditQuery extends PaginationQuery {
  @IsOptional() @IsString() entity?: string;
}

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'MODERATOR')
@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('users')
  listUsers(@Query() q: ListUsersQuery) {
    return this.admin.listUsers(q);
  }

  @Patch('users/:id/status')
  @Roles('ADMIN')
  setUserStatus(@CurrentUser() actor: AuthUser, @Param('id') id: string, @Body() dto: SetUserStatusDto) {
    return this.admin.setUserStatus(actor.id, id, dto.status);
  }

  @Patch('identity-verifications/:id')
  reviewIdentity(@CurrentUser() actor: AuthUser, @Param('id') id: string, @Body() dto: ReviewIdentityDto) {
    return this.admin.reviewIdentity(actor.id, id, dto.status, dto.notes);
  }

  @Get('properties')
  listProperties(@Query() q: ListPropertiesQuery) {
    return this.admin.listProperties(q);
  }

  @Patch('properties/:id/moderate')
  moderateProperty(@CurrentUser() actor: AuthUser, @Param('id') id: string, @Body() dto: ModeratePropertyDto) {
    return this.admin.moderateProperty(actor.id, id, dto.status, dto.verified);
  }

  @Get('reports')
  listReports(@Query() q: ListReportsQuery) {
    return this.admin.listReports(q);
  }

  @Patch('reports/:id')
  resolveReport(@CurrentUser() actor: AuthUser, @Param('id') id: string, @Body() dto: ResolveReportDto) {
    return this.admin.resolveReport(actor.id, id, dto.status, dto.resolution);
  }

  @Get('metrics')
  @Roles('ADMIN')
  metrics() {
    return this.admin.metrics();
  }

  @Get('audit-logs')
  @Roles('ADMIN')
  auditLogs(@Query() q: ListAuditQuery) {
    return this.admin.listAuditLogs(q);
  }
}
