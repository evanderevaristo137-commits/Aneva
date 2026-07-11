import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ReportTargetType } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthUser, CurrentUser } from '../../common/decorators/current-user.decorator';
import { PrismaService } from '../../prisma/prisma.service';

class CreateReportDto {
  @IsEnum(ReportTargetType)
  targetType: ReportTargetType;

  @IsString() @IsNotEmpty()
  targetId: string;

  @IsString() @Length(3, 200)
  reason: string;

  @IsOptional() @IsString() @Length(0, 2000)
  details?: string;
}

/** Sistema de denúncias — qualquer utilizador autenticado pode reportar. */
@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateReportDto) {
    return this.prisma.report.create({
      data: { reporterId: user.id, ...dto },
      select: { id: true, status: true, createdAt: true },
    });
  }
}
