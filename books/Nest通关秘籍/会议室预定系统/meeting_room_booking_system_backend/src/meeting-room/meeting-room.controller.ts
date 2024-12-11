import { Controller, DefaultValuePipe, Query } from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { generateParseIntPip } from 'src/utils';

@Controller('meeting-room')
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) {}

  async list(
    @Query('page', new DefaultValuePipe(1), generateParseIntPip('pageNoo'))
    pageNo: number,
  ) {}
}
