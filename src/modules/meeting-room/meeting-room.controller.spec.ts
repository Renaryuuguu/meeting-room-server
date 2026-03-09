import { Test, TestingModule } from '@nestjs/testing';
import { MeetingRoomController } from './meeting-room.controller';

describe('MeetingRoomController', () => {
  let controller: MeetingRoomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeetingRoomController],
    }).compile();

    controller = module.get<MeetingRoomController>(MeetingRoomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
