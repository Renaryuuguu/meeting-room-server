import { Controller, Get, Post } from '@nestjs/common';

@Controller('booking')
export class BookingController {
  @Post()
  booking() {
    return '';
  }

  @Get('my')
  my() {
    return 'my';
  }

  @Post(':id/cancel')
  bookingCancel() {
    return ':id/cancel';
  }

  @Get('pending')
  pending() {
    return 'pending';
  }

  @Post(':id/approve')
  approve() {
    return ':id/approve';
  }

  @Post(':id/reject')
  reject() {
    return ':id/reject';
  }
}
