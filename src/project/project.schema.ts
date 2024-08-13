import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../user/user.schema';

@Schema()
export class Project extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: [String] })
  images: string[];

  @Prop()
  clientUrl: string;

  @Prop({ default: true })
  isVisible: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
