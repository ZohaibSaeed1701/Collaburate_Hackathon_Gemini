import mongoose, { Document, Model, Schema } from "mongoose";

export interface LectureTS extends Document {
  title: string;
  pdfUrl: string;
  createdAt: Date;
}

const LectureSchema: Schema<LectureTS> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    pdfUrl: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Lecture: Model<LectureTS> =
  mongoose.models.Lecture || mongoose.model<LectureTS>("Lecture", LectureSchema);

export default Lecture;
