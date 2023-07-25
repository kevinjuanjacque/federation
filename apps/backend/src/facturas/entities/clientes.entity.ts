import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema()
export class Client extends Document {

    @Prop()
    rut: string;
    @Prop({ required: true })
    name: string;
    @Prop()
    dir: string;

}


export const ClientSchema = SchemaFactory.createForClass(Client);