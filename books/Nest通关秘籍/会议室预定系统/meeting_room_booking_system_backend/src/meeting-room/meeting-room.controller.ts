import { Controller, DefaultValuePipe, Get, Query } from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { generateParseIntPip } from 'src/utils';

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
}
