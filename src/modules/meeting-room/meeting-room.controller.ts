import { Controller, Get } from '@nestjs/common';

@Controller('meeting-room')
export class MeetingRoomController {
  @Get('meeting-room/list')
  meetingRoomList() {
    return 'meeting-room/list';
  }

  @Get('meeting-room/:id')
  meetingRoomID() {
    return 'meeting-room/:id';
  }
}
