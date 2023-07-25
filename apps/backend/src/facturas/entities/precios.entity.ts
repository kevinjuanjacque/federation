import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema()
export class Precio extends Document {

    @Prop({ required: true })
    name: string;
    @Prop({ required: true })
    precioNormal: string;
    @Prop({ required: true })
    precioEspecial: string;

}


export const PrecioSchema = SchemaFactory.createForClass(Precio);