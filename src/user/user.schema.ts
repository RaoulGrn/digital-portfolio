import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Project } from '../project/project.schema';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  email: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Project' }] })
  projects: Project[];

  @Prop()
  profilePicture: string;

  @Prop()
  biography: string;

  @Prop()
  domain: string;

  @Prop()
  city: string;

  @Prop()
  country: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
