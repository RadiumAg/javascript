import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MeetingRoom } from './entities/meeting-room.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MeetingRoomService {
  @InjectRepository(MeetingRoom)
  private repository: Repository<MeetingRoom>;

  constructor() {}

  initData() {
    const room1 = new MeetingRoom();
    room1.name = '木星';
    room1.capacity = 10;
    room1.equipment = '白板';
    room1.location = '一层西';

    const room2 = new MeetingRoom();
    room2.name = '金星';
    room2.capacity = 5;
    room2.equipment = '';
    room2.location = '二层东';

    const room3 = new MeetingRoom();
    room3.name = '天王星';
    room3.capacity = 30;
    room3.equipment = '白板，电视';
    room3.location = '三层东';

    this.repository.save([room1, room2, room3]);
  }

  async find(pageNo: number, pageSize: number) {
    if (pageNo < 1) {
      throw new BadRequestException('页码最小为1');
    }
    const skipCount = (pageNo - 1) * pageSize;

    const [mettingRooms, totalCount] = await this.repository.findAndCount({
      skip: skipCount,
      take: pageSize,
    });

    return {
      mettingRooms,
      totalCount,
    };
  }
}
