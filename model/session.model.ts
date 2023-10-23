import mongoose, { Types } from "mongoose";

export interface SessionDocument extends mongoose.Document {
  user_id: mongoose.ObjectId;
  user_agent?: string;
  valid: boolean;
}

const sessionSchema = new mongoose.Schema<SessionDocument>({
  user_id: {
    type: Types.ObjectId,
    ref: "User",
  },
  user_agent: {
    type: String,
  },
  valid: {
    type: Boolean,
    default: true,
  },
});

export const SessionModel = mongoose.model("Session", sessionSchema);
