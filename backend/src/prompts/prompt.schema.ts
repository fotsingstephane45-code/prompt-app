import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PromptDocument = HydratedDocument<Prompt>;

@Schema({ timestamps: true })
export class Prompt {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  question: string;
}

export const PromptSchema = SchemaFactory.createForClass(Prompt);