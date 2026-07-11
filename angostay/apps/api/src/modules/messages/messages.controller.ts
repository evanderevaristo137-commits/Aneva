import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthUser, CurrentUser } from '../../common/decorators/current-user.decorator';
import { MessagesService } from './messages.service';

class OpenConversationDto {
  @IsString() @IsNotEmpty()
  propertyId: string;
}

class SendMessageDto {
  @IsString() @Length(1, 4000)
  body: string;
}

@ApiTags('messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class MessagesController {
  constructor(private readonly messages: MessagesService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.messages.listConversations(user.id);
  }

  @Post()
  open(@CurrentUser() user: AuthUser, @Body() dto: OpenConversationDto) {
    return this.messages.openConversation(user.id, dto.propertyId);
  }

  @Get(':id/messages')
  listMessages(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.messages.listMessages(user.id, id);
  }

  @Post(':id/messages')
  send(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: SendMessageDto) {
    return this.messages.send(user.id, id, dto.body);
  }
}
