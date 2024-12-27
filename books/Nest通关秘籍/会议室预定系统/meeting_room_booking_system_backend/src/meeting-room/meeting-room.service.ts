import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { MeetingRoom } from './entities/meeting-room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';

@Injectable()
export class MeetingRoomService {
  @InjectRepository(MeetingRoom)
  private repository: Repository<MeetingRoom>;

  @InjectRepository(EntityManager)
  private entityManager: Repository<EntityManager>;

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

  async create(meetingRoomDto: CreateMeetingRoomDto) {
    const room = await this.repository.findOneBy({ name: meetingRoomDto.name });

    if (room) {
      throw new BadRequestException('会议室名字已存在');
    }
    return await this.repository.insert(meetingRoomDto);
  }

  async update(mettingRoomDto: UpdateMeetingRoomDto) {
    const meetingRoom = await this.repository.findOneBy({
      id: mettingRoomDto.id,
    });

    if (!meetingRoom) {
      throw new BadRequestException('会议不存在');
    }

    meetingRoom.capacity = mettingRoomDto.capacity;
    meetingRoom.location = mettingRoomDto.location;
    meetingRoom.name = mettingRoomDto.name;

    if (mettingRoomDto.description) {
      meetingRoom.description = mettingRoomDto.description;
    }

    if (mettingRoomDto.equipment) {
      meetingRoom.description = mettingRoomDto.equipment;
    }

    await this.repository.update(
      {
        id: meetingRoom.id,
      },
      meetingRoom,
    );

    return 'success';
  }

  async findById(id: number) {
    return this.repository.findOneBy({ id });
  }

  async delete(id: number) {
    const boookings = await this.entityManager.findBy(Booking, {
      room: {
        id,
      },
    });
  }
}
