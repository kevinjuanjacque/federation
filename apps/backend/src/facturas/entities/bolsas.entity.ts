import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Bolsa extends Document {
  @Prop({ required: true })
  bolsa: string;
  @Prop({ required: true })
  tipo: string;
}

export const BolsaSchema = SchemaFactory.createForClass(Bolsa);
