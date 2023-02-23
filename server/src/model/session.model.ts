import mongoose from "mongoose";
import { UserDocument } from "./user.model";

//spécifie les propriétés requises pour un document de session.
export interface SessionDocument extends mongoose.Document {
  user: UserDocument["_id"];
  valid: boolean;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },     //référence un document utilisateur dans une autre collection nommée "User".
    valid: { type: Boolean, default: true },                         //stocke le navigateur de l'utilisateur associé à cette session.
    userAgent: { type: String },                                
  },
  { timestamps: true }
);

const Session = mongoose.model<SessionDocument>("Session", SessionSchema);

export default Session;