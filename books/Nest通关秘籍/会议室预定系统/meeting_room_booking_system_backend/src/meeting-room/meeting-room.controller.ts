import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { generateParseIntPip } from 'src/utils';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';

@Controller('meeting-room')
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) {}

  @Get('list')
  async list(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPip('pageNo'))
    pageNo: number,
    @Query('paeSize', new DefaultValuePipe(2), generateParseIntPip('pageSize'))
    pageSize: number,
  ) {
    return await this.meetingRoomService.find(pageNo, pageSize);
  }

  @Post('create')
  async create(@Body() meetingRoomDto: CreateMeetingRoomDto) {
    return await this.meetingRoomService.create(meetingRoomDto);
  }

  @Put('update')
  async update(@Body() meetingRoomDto: UpdateMeetingRoomDto) {
    return await this.meetingRoomService.update(meetingRoomDto);
  }
}
