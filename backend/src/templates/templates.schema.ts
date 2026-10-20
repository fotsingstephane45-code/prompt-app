import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export const CATEGORIES = ['Rédaction', 'Créativité', 'Développement', 'Marketing', 'Productivité'];

export type TemplateDocument = HydratedDocument<Template>;

@Schema({ timestamps: true })
export class Template {
  @Prop({ required: true })
  titre: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  contenu: string;

  @Prop({ required: true, enum: CATEGORIES })
  categorie: string;

  @Prop({ required: true })
  auteurNom: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  auteur?: Types.ObjectId;

  @Prop({ default: 0 })
  likesCount: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  likedBy: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  savedBy: Types.ObjectId[];
}

export const TemplateSchema = SchemaFactory.createForClass(Template);