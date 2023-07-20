import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Factura extends Document {

    @Prop({ required: true })
    numero: number;
    @Prop({ required: true })
    fecha: Date;
    @Prop({ required: true })
    static: string;

}


export const FacturaSchema = SchemaFactory.createForClass(Factura);