import { Module } from '@nestjs/common';
import { FacturasController } from './facturas.controller';
import { FacturasService } from './facturas.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Factura, FacturaSchema } from './entities/facturas.entity';
import { Client, ClientSchema } from './entities/clientes.entity';
import { Bolsa, BolsaSchema } from './entities/bolsas.entity';
import { Precio, PrecioSchema } from './entities/precios.entity';
import { Boleta, BoletaSchema } from './entities/boleta.entity';

@Module({
  controllers: [FacturasController],
  providers: [FacturasService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Factura.name,
        schema: FacturaSchema,
      },
      {
        name: Client.name,
        schema: ClientSchema,
      },
      {
        name: Bolsa.name,
        schema: BolsaSchema,
      },{
        name: Precio.name,
        schema: PrecioSchema,
      }
      ,{
        name: Boleta.name,
        schema: BoletaSchema,
      }
    ])
  ],
})


export class FacturasModule {}
