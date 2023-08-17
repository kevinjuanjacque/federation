import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Boleta extends Document {
  @Prop({ required: true })
  nombreCliente: string;
  @Prop()
  rutCliente: string;
  @Prop()
  dirCliente: string;
  @Prop({ required: true })
  bultos: string;
  @Prop({ required: true })
  fecha: Date;
  @Prop({ required: true })
  detalle: [
    {
      bolsa: string;
      cantidad: string;
      precio: string;
      tipo: 'Normal' | 'Especial';
    }
  ];
  @Prop({ type: Object })
  precio: { precioNormal: string; precioEspecial: string };
  @Prop({ default: false })
  iva: boolean;
}

export const BoletaSchema = SchemaFactory.createForClass(Boleta);
