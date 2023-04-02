import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ICourse } from 'src/interfaces/course.interface';

@Schema()
export class Course extends Document implements ICourse {
  @Prop()
  SESSION: string;

  @Prop()
  COL: string;

  @Prop()
  DPT: string;

  @Prop()
  CRN: string;

  @Prop()
  SUBJ_CRS: string;

  @Prop()
  SEC: string;

  @Prop()
  TYPE: string;

  @Prop()
  TITLE: string;

  @Prop()
  CR: number;

  @Prop()
  PMT: string;

  @Prop()
  STATUS: string;

  @Prop()
  STATUS2: string;

  @Prop()
  SEATSREMAIN: number;

  @Prop()
  WAITSEATSAVAIL: number;

  @Prop()
  CAP: number;

  @Prop()
  ENRL: number;

  @Prop()
  DAYS: string;

  @Prop()
  TIME: string;

  @Prop()
  BLDG: string;

  @Prop()
  ROOM: string;

  @Prop()
  INSTRUCTOR: string;

  @Prop()
  CAMPUS: string;

  @Prop()
  DELIVERYMETHOD: string;

  @Prop()
  FEES: number;

  @Prop()
  questions: string[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
