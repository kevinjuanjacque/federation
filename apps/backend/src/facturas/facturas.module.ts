import { Module } from '@nestjs/common';
import { FacturasController } from './facturas.controller';
import { FacturasService } from './facturas.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Factura, FacturaSchema } from './entities/facturas.entity';

@Module({
  controllers: [FacturasController],
  providers: [FacturasService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Factura.name,
        schema: FacturaSchema,
      }
    ])
  ],
})


export class FacturasModule {}
