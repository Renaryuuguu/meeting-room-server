import { Global, Module } from '@nestjs/common';
import { PrimsaService } from './prisma.service';

@Global()
@Module({
  providers: [PrimsaService],
  exports: [PrimsaService],
})
export class PrimsaModule {}
