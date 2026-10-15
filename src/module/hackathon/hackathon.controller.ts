import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  AuthGuard,
  Roles,
  Session,
  type UserSession,
} from '@thallesp/nestjs-better-auth';
import { ResponseMessage } from '../../common/decorators/response-message.decorator.js';
import { UserRole } from '../../generated/prisma/client.js';
import { CreateHackathonDto } from './dto/create-hackathon.dto.js';
import { UpdateHackathonDto } from './dto/update-hackathon.dto.js';
import { HackathonService } from './hackathon.service.js';

@Controller('hackathon')
@UseGuards(AuthGuard)
export class HackathonController {
  constructor(private readonly hackathonService: HackathonService) {}

  @Post()
  @Roles([UserRole.ADMIN])
  @ResponseMessage('Hackathon created')
  create(
    @Body() createHackathonDto: CreateHackathonDto,
    @Session() session: UserSession,
  ) {
    return this.hackathonService.create(createHackathonDto, session.user.id);
  }

  @Get()
  findAll() {
    return this.hackathonService.findAll();
  }

  @Post(':id/join')
  @Roles([UserRole.PARTICIPANT])
  @ResponseMessage('Joined hackathon')
  join(@Param('id') id: string, @Session() session: UserSession) {
    return this.hackathonService.join(id, session.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hackathonService.findOne(id);
  }

  @Patch(':id')
  @Roles([UserRole.ADMIN])
  @ResponseMessage('Hackathon updated')
  update(
    @Param('id') id: string,
    @Body() updateHackathonDto: UpdateHackathonDto,
  ) {
    return this.hackathonService.update(id, updateHackathonDto);
  }

  @Delete(':id')
  @Roles([UserRole.ADMIN])
  @ResponseMessage('Hackathon deleted')
  remove(@Param('id') id: string) {
    return this.hackathonService.remove(id);
  }
}
