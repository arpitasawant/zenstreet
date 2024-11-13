import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Event extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  date: Date;

  @Prop()
  description: string;

  @Prop()
  media: string; 

  @Prop({ required: false }) 
  reminderTime: Date; 
}

export const EventSchema = SchemaFactory.createForClass(Event);
